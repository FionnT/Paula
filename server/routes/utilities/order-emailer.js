// Current plan is to generate HTML string from template using pug.renderFile()
// We can then post this using SES transporter
// This is possible using React, but a bit more difficult and we don't need the complexity

const nodemailer = require("nodemailer")
const sesTransport = require("nodemailer-ses-transport")

const sesTransporter = nodemailer.createTransport(
  sesTransport({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })
)

const sendOrderEmails = (orderID, paymentSucceeded, recordSaved, paymentIntent, message) => {
  if (paymentSucceeded) {
    if (recordSaved) {
      console.log("Payment succeeded, and record saved!")
    } else {
    }
  } else if (!paymentSucceeded) {
  }
}

module.exports = sendOrderEmails
