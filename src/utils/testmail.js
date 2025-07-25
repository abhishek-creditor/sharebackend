let { sendMail,sendMailToMultiUsers } = require('./mail.js');


sendMail("zubair@creditoracademy.com", "this is the test mail for nodemailer", "hello there this is body of email");

console.log("mail is sent");
