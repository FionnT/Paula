const server = require("express")()
const jsonParser = require("body-parser").json()
const nodemailer = require("nodemailer")
const sesTransport = require("nodemailer-ses-transport")

const sesTransporter = nodemailer.createTransport(
  sesTransport({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })
)

server.post("/contact", jsonParser, (req, res) => {
  const { email, name, text } = req.body
  const replyTo = () => {
    if (name) return name + " <" + email + ">"
    else return email
  }
  const mailOptions = {
    to: process.env.CONTACTABLE_EMAIL,
    from: process.env.CONTACT_FORM_EMAIL,
    replyTo: replyTo().toString(),
    subject: "Contact form submission",
    text
  }
  sesTransporter.sendMail(mailOptions, err => {
    if (err) console.log(err)
    else res.sendStatus(200)
  })
})

module.exports = server
