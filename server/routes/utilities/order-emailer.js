// Convert images to Base64 to avoid bandwidth costs
// Generate HTML string from template file using PUG
// Send using SES Transporter
// This is possible using React, but a bit more difficult and we don't need the complexity

const pug = require("pug")
const fs = require("fs")
const path = require("path")
const nodemailer = require("nodemailer")
const sesTransport = require("nodemailer-ses-transport")

const imagesLocation = path.join(__dirname, "../../../public/store/")
const emailTemplate = path.join(__dirname, "../../emails/email.pug")

const messages = {
  payed: {
    status: "Payment Succeeded",
    message: "Thank you for your order! The payment was successful, and we'll be shipping it soon!"
  },
  received: {
    status: "Order Received",
    message: "Thank you for your purchase! We've received your order, and your payment will be processed shortly. You can view your order details below."
  },
  failed: {
    status: "Payment Failed",
    message: "Unfortunately the payment for your order has failed, and we won't be able to ship it to you. Click below to retry."
  }
}

const sesTransporter = nodemailer.createTransport(
  sesTransport({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })
)

const itemImagesToBase64 = async items => {
  await items.forEach(item => {
    const imageFile = path.join(imagesLocation, item.image)
    const base64Image = fs.readFileSync(imageFile, { encoding: "base64" })
    item.encodedImage = "data:image/png;base64," + base64Image
  })
  return items
}

const sendOrderEmails = async (orderData, orderStatus) => {
  orderData.status = messages[orderStatus].status
  orderData.message = messages[orderStatus].message
  orderData.paymentSucceeded = orderStatus !== "failed" ? true : false

  const attachments = [
    {
      cid: "header.png",
      path:
        "data:image/png;base64,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"
    },
    {
      cid: "instagram.png",
      path:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALjSURBVEhL5ZZPSBtBFMa/9mJBJMe9iIKIuelBCZ4MNNCwF8E/rAQhFyGX2kAMXhSCCFGKaCB6CuQixeBiFIoQoqQQiGDFHCIKjQchsgeXHGzw4m36djY1uzZxU2k9tD94O8vb2fftzrw3M6/u7u4YXpDX1fbF+I8FK1dpxAKTcPW1oa2tSetzYTIQQ/qqUo1SBy1pzKaw3LKbCYCWTM80gbmXc0z5JTYlqNlRZrkFh/6S4Gah5ClTysbnFlZW2GkyxNyCLuxYyLHyoz5mwaMwc3AxicUvDP7ftYs4k7iog4WPzM8Mc3iP7G4UJ3TnjaxB6tC9zVNB9uMk3n8qAh0S1iJe8p0gupulyDUMgkUUDlVqfRgesukuExWUDmIISgPo5knSjQEpiNhBiZ5ofIda+Ipv6j0XsA0NUyRAPSxQZAO1382wEJ/wEMsYhoDbTY6FRUGf2zomiGGWu3n0ToN4TdRhCXJgDPMpFYIYwk5e0T6Sm5LfQUgUoKbmMRaQqac1loKVVBRzCRLzxJGRZ+HuqQ23rceNWTmDuIdEE3OIpp6ovyoWgiqyezG69sE/LaGz6jXTCWnaTz1UxPaydH0aC8ESigmtfYfBXu6oT+8g9SASRcthbWIO/ywWgp2we7T2AMdn3FGfs2PqQXjsDYa9hoWgAOeIj64FRDcaZSFl8UaUegjwjTjp+jSWQ2oT/VjiWTgFl7SC9GUtEyuXaaxILkzxLF6CX6y3YJhpYg4pCyNJUOFTvS1ivL/9YTtq7x/HIq/PMJKRRllsxiDYghaeiTe4fVxOrVQWch7nyVX4RHt12ATYRR9Wk+fIy1QWrdxZo3JLkYheissdVX4uOdrWtB/Uly/vlvKwFD3XlC2vvuwF901blOEP38A56gdtT9gMzEC+1r3P4lrGTGCTbhzwjzopsgHjV738Bszt7x4xGh6EtUPU9vomtr98xslV1WlFlwPDbyfg/TABd1f9EvnXT97ADzz2/BLq58thAAAAAElFTkSuQmCC"
    },
    {
      cid: "facebook.png",
      path:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAkCAYAAAAHKVPcAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGTSURBVFhH7ZcxSAJRHMa/IsgGuZoSgoZrDVvCRsGlRS9obA1cojHaIgIJihsaSmjLvcFyNRDUoVq8KYeGwEWc5BaF4noP/68kz+vonijxfvDx3n0H//dx7/3h3ZRt2w7GzDSNY0WFEKgQgokIAd6ibmpVTMfQwdtXjnTDMSst17WGhCg7mahLoaCKZpyyy3pDtqOLrsXHIxRtmwcNqCKrxLBYXT7+4L8dzDbq9+fYS6wiHA73lL5Dk956ISlEBzVzG+s7J8g9vZHH6HRo4o2cEO0ScseP9MDQY4gn4ogvaWR4IyfEq4U8TVkHoFwropAvoHC6iUWyvZAT4gPfe78SQYSmfpF4MP9OgBA1XG8lkeQ6vCGPUT3DrvAv+s6JBwFCdNF+KKHE1d8RzXrPY3p5nyXTm5Fux8ayv9MRIEQM+40GGly3B+QxUpd4Jv8q5ac3An6JkKZB41qYI4cxE8K88EPk/cJIt8MvKoRAhfiC3XwGrlsTcr1bQzprgl105aEbMLNpVnkQ9UMsUCEEKoRgAkIAnw+wVU7xQhx1AAAAAElFTkSuQmCC"
    }
  ]

  await itemImagesToBase64(orderData.items, update => (orderData.items = update))

  await orderData.items.forEach(item => {
    attachments.push({ filename: item.image, path: item.encodedImage, cid: item.image })
  })

  const html = pug.renderFile(emailTemplate, { order: orderData })

  const mailOptions = {
    to: orderData.email,
    from: "Paula Trojner <" + process.env.STORE_EMAIL + ">",
    replyTo: process.env.STORE_EMAIL,
    subject: orderData.status,
    attachments,
    html
  }

  sesTransporter.sendMail(mailOptions, err => {
    if (err) console.log(err)
    else return
  })
}

module.exports = sendOrderEmails
