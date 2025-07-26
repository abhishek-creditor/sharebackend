const prisma = require('../../config/prismaClient')


async function createPayment(data){
return await prisma.payment.create({data})
}

async function getPaymentByOrderId(order_id) {
  return await prisma.payments.findUnique({
    where: { order_id }
  });
}

async function updatePaymentByOrderId(order_id, updateData){
    return await prisma.payment.update({
        where: {order_id},
        data: updateData
    });
}

async function getPaymentByTransactionId(transaction_id){
    return await prisma.payment.findFirst({
        where: {transaction_id}
    })
}

async function listPaymentByUser(user_id){
    return await prisma.payment.findMany({
        where:{user_id},
        orderBy: {created_at: 'desc'}
    })

}


module.exports = {
    createPayment,
    getPaymentByOrderId,
    updatePaymentByOrderId,
    getPaymentByTransactionId,
    listPaymentByUser

}


















// creditor_backend/src/controllers/paymentController.js

const paymentDao = require('../dao/transactionDao');
const orderDao = require('../dao/orderDao');
const { createPayment } = require('../services/westCoastService');
const { isValidWebhook } = require('../utils/webhookValidator');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const messages = require('../utils/messages');

// Initiate Payment
async function initiatePayment(req, res) {
  try {
    const { order_id } = req.params;
    const { method, ...paymentDetails } = req.body;

    if (!['card', 'upi', 'netbanking', 'wallet'].includes(method)) {
      return errorResponse(req, res, 400, 'Invalid payment method');
    }

    const order = await orderDao.findOrderById(order_id);
    if (!order) return errorResponse(req, res, 404, messages.ORDER_NOT_FOUND);

    const existingPayment = await paymentDao.getPaymentByOrderId(order_id);
    if (existingPayment && existingPayment.status === 'SUCCESS') {
      return errorResponse(req, res, 400, messages.PAYMENT_ALREADY_PAID);
    }

    const callback_url = process.env.PAYMENT_CALLBACK_URL;
    const paymentRes = await createPayment({
      amount: order.total_amount,
      method,
      reference: order_id,
      callback_url,
      ...paymentDetails,
    });

    const payment = await paymentDao.createPayment({
      order_id,
      amount: order.total_amount,
      status: 'PENDING',
      transaction_id: paymentRes.transaction_id,
      payment_method: method,
      payment_url: paymentRes.payment_url,
      gateway_response: paymentRes,
    });

    return successResponse(
      req,
      res,
      {
        transaction_id: paymentRes.transaction_id,
        payment_url: paymentRes.payment_url,
      },
      201,
      messages.PAYMENT_INITIATED
    );
  } catch (err) {
    console.error('Payment initiation error:', err);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

// Webhook Handler
async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-webhook-signature'];
    const rawBody = req.body; // Should be Buffer if using express.raw

    if (!isValidWebhook(rawBody, signature)) {
      return res.status(401).send('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    const { transaction_id, status, order_id } = payload;

    await paymentDao.updatePaymentByOrderId(order_id, {
      status: status.toUpperCase(),
      gateway_response: payload,
    });

    if (status.toUpperCase() === 'SUCCESS') {
      await orderDao.markOrderPaid(order_id);
    }

    return res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).send(messages.SERVER_ERROR);
  }
}

// Get Payment Status
async function getStatus(req, res) {
  try {
    const { id } = req.params;
    let payment = await paymentDao.getPaymentByOrderId(id);
    if (!payment) {
      payment = await paymentDao.getPaymentByTransactionId(id);
    }
    if (!payment) {
      return errorResponse(req, res, 404, 'Payment not found');
    }
    return successResponse(
      req,
      res,
      {
        order_id: payment.order_id,
        transaction_id: payment.transaction_id,
        status: payment.status,
        amount: payment.amount,
        payment_method: payment.payment_method,
        payment_url: payment.payment_url,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
      },
      200,
      messages.PAYMENT_STATUS
    );
  } catch (err) {
    console.error('Get payment status error:', err);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

module.exports = {
  initiatePayment,
  handleWebhook,
  getStatus,
};

