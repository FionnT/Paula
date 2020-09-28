const server = require("express")()
const jsonParser = require("body-parser").json()

const sendOrderEmails = require("../utilities/order-emailer")
const privileged = require("../middleware/privileged")
const authenticated = require("../middleware/authenticated")()

const { Order } = require("../../models/index")

const stripe = require("stripe")(process.env.STRIPE_SERVER_SECRET)

server.get("/admin/orders", authenticated, privileged(0), async (req, res) =>
  Order.find({})
    .lean()
    .exec((err, result) => {
      if (err) res.sendStatus(502)
      else if (result) res.json(result)
      else res.sendStatus(500)
    })
)

server.post("/admin/orders/fetch", authenticated, privileged(0), jsonParser, async (req, res) => {
  let orderID = req.body.orderID
  Order.find({ orderID })
    .lean()
    .exec((err, result) => {
      if (err) res.sendStatus(502)
      else if (result) res.json(result)
      else res.sendStatus(500)
    })
})

server.post("/admin/orders/resend-notification", authenticated, privileged(0), jsonParser, async (req, res) => {
  let orderID = req.body.orderID
  Order.findOne({ orderID }, (err, result) => {
    if (err) res.sendStatus(502)
    else if (result) {
      sendOrderEmails(result.toObject())
    } else res.sendStatus(500)
  })
})

server.post("/admin/orders/confirm-shipment", authenticated, privileged(0), jsonParser, async (req, res) => {
  let orderID = req.body.orderID
  Order.findOne({ orderID, status: "payed" }, (err, result) => {
    if (err) res.sendStatus(502)
    else if (result) {
      result.status = "shipped"
      result.save().then(() => {
        sendOrderEmails(result)
        res.sendStatus(200)
      })
    } else res.sendStatus(404)
  })
})

server.post("/admin/orders/cancel", authenticated, privileged(0), jsonParser, (req, res) => {
  let orderID = req.body.orderID
  Order.findOne({ orderID }, async (err, result) => {
    if (err) res.sendStatus(502)
    else if (result) {
      stripe.refunds
        .create({
          charge: result.chargeID,
          reason: "requested_by_customer"
        })
        .then(() => {
          result.status = "cancelled"
          result.save().then(() => {
            sendOrderEmails(result)
            res.json({ status: 200, state: "cancelled", message: "Order cancelled & refunded" })
          })
        })
        .catch(err => {
          console.log(err)
          res.json({ status: 404, state: result.status, message: err.raw.message })
        })
    } else res.sendStatus(500)
  })
})

server.post("/admin/orders/delete", authenticated, privileged(0), jsonParser, async (req, res) => {
  let orderID = req.body.orderID
  Order.findOneAndDelete({ orderID, status: "cancelled" }, (err, result) => {
    if (err) res.sendStatus(502)
    else if (result) res.sendStatus(200)
    else res.sendStatus(404)
  })
})

module.exports = server
