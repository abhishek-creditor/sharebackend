const prisma = require("../../config/prismaClient");

async function seedOrders() {
  try {
    await prisma.orders.createMany({
      data: [
        {
          id: 'order-1',
          user_id: 'userId-1',
          total_amount: 299.99,
          order_status: 'COMPLETED',
          payment_id: 'PAY123',
          payment_method: 'Credit Card',
        },
        {
          id: 'order-2',
          user_id: 'userId-2',
          total_amount: 149.49,
          order_status: 'PENDING',
          payment_id: 'PAY456',
          payment_method: 'UPI',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Orders seeded');
  } catch (err) {
    console.error('Error seeding orders:', err);
  }
}


module.exports = { seedOrders };
