const nodemailer = require("nodemailer");
require("dotenv").config();
// create reusable transporter object using the default SMTP transport

const sendEmail = (to, text, subject) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // your Gmail email address
      pass: process.env.EMAIL_PASSWORD, // your Gmail password
    },
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
