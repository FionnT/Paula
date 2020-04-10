const server = require("express")()
const { Photoshoots, StoreItems } = require("../models/index")

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

module.exports = server
