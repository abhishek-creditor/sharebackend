const nodemailer = require("nodemailer");
// const config = require("../config/");
require("dotenv").config();

const smtpConfig = {
  // host: process.env.EMAIL_SERVER_HOST,#
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

const sendMail = async function (emailTo,emailSubject,emailBody,Attachment = {}) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailTo,
      subject: emailSubject,
      text: emailBody,
    };
    if (Attachment) {
      // mailOptions.attachments = [Attachment];
    }
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Unable to trigger sending email" ,error);
    throw error;
  }
};

const sendMailToMultiUsers = async function (emailTo,emailSubject,emailBody,Attachment = {}) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailTo.join(', '),
      subject: emailSubject,
      text: emailBody,
    };
    if (Attachment) {
      mailOptions.attachments = [Attachment];
    }

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Unable to trigger sending email" ,error);
    throw error;
  }
};

module.exports = { sendMail,sendMailToMultiUsers };