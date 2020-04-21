const server = require("express")()
const { Photoshoots, StoreItems, Order } = require("../models/index")
const stripe = require("stripe")("sk_test_7RghujgfmekcXKjLchTUaVpJ00EDFylgdq")
const jsonParser = require("body-parser").json()

server.get("/photoshoots/home", (req, res) => {
  Photoshoots.find({ isPublished: true, isOnHomeScreen: true }, (err, results) => {
    if (err) res.sendStatus(502)
    else res.json(results)
  })
})

server.get("/store/items", (req, res) => {
  StoreItems.find({ isPublished: true }, (err, results) => {
    if (err) res.sendStatus(502)
    else res.json(results)
  })
})

server.post("/store/paymentintent", jsonParser, async (req, res) => {
  res.locals.verifiedCost = 0

  StoreItems.find({}, async (err, results) => {
    if (err) res.sendStatus(502)
    else {
      // Calculate purchase cost server again, to prevent malicious actors
      const purchase = {
        items: [],
        cost: 0
      }

      req.body.items.forEach(item => {
        purchase.items.push({ UUID: item.UUID, size: item.size, amount: item.amount })
      })

      results.forEach(result => {
        purchase.items.forEach(item => {
          if (result.UUID === item.UUID) {
            const selected_size = result.sizes.filter(size => size.measurements === item.size)[0]
            purchase.cost += selected_size.cost * item.amount * 100
          }
        })
      })

      // Create and send payment intent based on calculated cost
      const paymentIntent = await stripe.paymentIntents.create({
        amount: purchase.cost,
        currency: "eur"
      })
      res.json({ secret: paymentIntent.client_secret })
    }
  })
})

module.exports = server
