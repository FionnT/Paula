const server = require("express")()
const { Photoshoots } = require("../models/index")

server.get("/photoshoots/home", (req, res) => {
  Photoshoots.find({ isPublished: true, isOnHomeScreen: true }, (err, results) => {
    if (err) res.sendStatus(502)
    else res.json(results)
  })
})

module.exports = server
