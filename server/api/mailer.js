
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const nodemailer = require("nodemailer");
//const dotenv = require("dotenv");

//dotenv.config();
//require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

async function sendEmail(to, subject, text, html) {
  let transporter = createTransporter();
  try {
    let info = await transporter.sendMail({
      from: "no-reply@example.com",
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendEmail };
