const { v4: uuidv4 } = require("uuid")
const server = require("express").Router()
const jsonParser = require("body-parser").json()
const textParser = require("body-parser").text({ type: "*/*" })
const busboy = require("connect-busboy")()
const stripe = require("stripe")(process.env.STRIPE_SERVER_SECRET)

const sendOrderEmails = require("./utilities/order-emailer")
const privileged = require("./middleware/privileged")
const authenticated = require("./middleware/authenticated")()
const { StoreItems, Order } = require("../models/index")

server.get("/store/items", (req, res) => {
  StoreItems.find({ isPublished: true }, (err, results) => {
    if (err) res.sendStatus(502)
    else res.json(results)
  })
})

//, authenticated, privileged(2)
server.post("/store/upload/json", jsonParser, (req, res) => {
  return new Promise(resolve => {
    const StoreItem = new StoreItems(req.body)
    const extLocation = req.body.image.split(".").length - 1
    const extension = req.body.image.split(".")[extLocation]
    StoreItem.UUID = "893effd5-2043-46e3-9fe6-59a9b3f17044"
    StoreItem.image = StoreItem.UUID + "." + extension
    StoreItem.save()
      .then(res.json({ UUID: StoreItem.UUID }))
      .then(resolve())
  })
})

server.post("/store/upload/update", jsonParser, (req, res) => {
  return new Promise(resolve => {
    StoreItems.findOne({ UUID: req.body.UUID }, (err, result) => {
      if (err) res.send(500)
      if (result) {
        Object.assign(result, req.body)
        result.save().then(res.sendStatus(200)).then(resolve())
      } else res.sendStatus(403)
    })
  })
})

server.post("/store/paymentintent", jsonParser, async (req, res) => {
  StoreItems.find({}, async (err, results) => {
    if (err) res.sendStatus(500)
    else {
      const cart = req.body
      const orderID = uuidv4()
      const purchase = {
        items: [],
        cost: 0
      }

      // 1. Populate purchase.items with each individual item, in each selected size
      // 2. Calculate purchase cost of items
      cart.items.forEach(item => {
        purchase.items.push({ UUID: item.UUID, size: item.size, amount: item.amount, image: item.image })
      })
      results.forEach(result => {
        purchase.items.forEach(item => {
          if (result.UUID === item.UUID) {
            const selected_size = result.sizes.filter(size => size.measurements === item.size)[0]
            purchase.cost += selected_size.cost * item.amount * 100
          }
        })
      })

      // Create Stripe payment intent based on calculated cost
      const paymentIntent = await stripe.paymentIntents
        .create({
          amount: purchase.cost,
          currency: "eur",
          metadata: {
            orderID: orderID
          }
        })
        .catch(err => {
          res.json({ error: err })
        })
      if (paymentIntent) {
        cart.orderID = orderID
        cart.items = purchase.items // Only store the ordered sizes, instead of all
        cart.purchaseCost = purchase.cost / 100
        cart.expireAt = Date.now() + 1000 * 10
        const order = new Order(cart)
        order.save().then(res.json({ paymentIntent: paymentIntent.client_secret }).end())
      }
    }
  })
})

server.post("/store/confirm-order", textParser, async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers["stripe-signature"]
  const body = req.body

  let event = null

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    // invalid signature
    res.sendStatus(500).end()
    return
  }

  const saveOrderThroughFallback = orderID => {
    // Create and save a new order instead, old one will auto-expire
    Order.find({ orderID }, (err, data) => {
      if (err) {
        console.log(err)
        sendOrderEmails(orderID, true, false) // Payment succeeded, record update didn't
        res.sendStatus(500)
      } else {
        const orderData = data.toJSON()
        const order = new Order(orderData)
        order.save().then(() => {
          sendOrderEmails(orderData, true, true) // Payment and record update succeeded
          res.sendStatus(200).end()
        })
      }
    })
  }

  // eslint-disable-next-line default-case
  switch (event["type"]) {
    case "payment_intent.succeeded":
      const orderID = event.data.object.metadata.orderID
      Order.findOneAndUpdate({ orderID }, { $unset: { expireAt: "" } }, (err, data) => {
        if (err) saveOrderThroughFallback(orderID)
        else {
          sendOrderEmails(data, true, true) // Payment and record update succeeded
          res.sendStatus(200).end()
        }
      })
      return
    case "payment_intent.payment_failed":
      let intent = event.data.object
      const message = intent.last_payment_error && intent.last_payment_error.message
      sendOrderEmails(orderID, false, false, intent.id, message) // Payment failed
      return
  }
})

// server.post("/upload/images", authenticated, privileged(2), busboy, (req, res) => {
//   // TODO - Make it save images
//   // req.pipe(busboy)
//   let url
//   return new Promise(resolve => {
//     const Photoshoot = new Photoshoots(req.body)
//     Photoshoots.findOne({ url }, (err, result) => {
//       if (err) res.sendStatus(502)
//       if (result) {
//         Photoshoot.save().then(res.sendStatus(200)).then(resolve())
//       } else res.sendStatus(403)
//     })
//   })
//   // req.busboy.on("field")
// })

module.exports = server
