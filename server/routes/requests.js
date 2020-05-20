const server = require("express")()
const { Photoshoots, StoreItems, Order } = require("../models/index")
const jsonParser = require("body-parser").json()

server.get("/photoshoots/home", (req, res) => {
  Photoshoots.find({ isOnHomeScreen: true })
    .sort("isInHomePosition")
    .exec((err, results) => {
      if (err) res.sendStatus(502)
      else res.json(results)
    })
})

server.get("/photoshoots/all", (req, res) => {
  Photoshoots.find({})
    .sort("isInHomePosition")
    .exec((err, results) => {
      if (err) res.sendStatus(502)
      else res.json(results)
    })
})

module.exports = server
