const server = require("express")()
const cors = require("cors")()
const { Photoshoots } = require("../models/index")

server.get("/photoshoots/home", cors, (req, res) => {
  Photoshoots.find({ isPublished: true, isOnHomeScreen: true }, (err, results) => {
    console.log(req)
    if (err) res.sendStatus(502)
    else res.json(results)
    console.log(res)
  })
})

module.exports = server
