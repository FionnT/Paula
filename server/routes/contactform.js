const server = require("express")()
const jsonParser = require("body-parser").json()
const nodemailer = require("nodemailer")
const sesTransport = require("nodemailer-ses-transport")

server.post("/contact", jsonParser, (req, res) => {
  const { from, subject, text } = req.body
  const mailOptions = {
    to: "hello@paulatrojner.com",
    from,
    subject,
    text
  }
  // sesTransporter.sendMail(mailOptions, callback)
  sesTransporter.sendMail(mailOptions, err => {
    if (err) res.sendStatus(502)
    else res.sendStatus(200)
  })
})

const sesTransporter = nodemailer.createTransport(
  sesTransport({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })
)
module.exports = server
