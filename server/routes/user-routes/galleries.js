const server = require("express")()
const { Photoshoots } = require("../../models/index")

server.get("/photoshoots/home", (req, res) => {
  Photoshoots.find({ isOnHomeScreen: true })
    .sort("isInHomePosition")
    .exec((err, results) => {
      if (err) res.sendStatus(500)
      else res.json(results)
    })
})

module.exports = server
