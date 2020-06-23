const server = require("express")()
const { Photoshoots, StoreItems, Order, Admin } = require("../models/index")
const jsonParser = require("body-parser").json()
const privileged = require("./middleware/privileged")
const authenticated = require("./middleware/authenticated")()

server.get("/photoshoots/home", (req, res) => {
  Photoshoots.find({ isOnHomeScreen: true })
    .sort("isInHomePosition")
    .exec((err, results) => {
      if (err) res.sendStatus(500)
      else res.json(results)
    })
})

server.get("/photoshoots/all", authenticated, privileged(2), (req, res) => {
  Photoshoots.find({})
    .sort("isInHomePosition")
    .lean()
    .exec((err, results) => {
      if (err) res.sendStatus(502)
      else {
        let responseBody = {
          homeGalleries: [],
          privateGalleries: [],
          unpublishedGalleries: []
        }
        results.forEach(photoshoot => {
          if (photoshoot.isOnHomeScreen) responseBody.homeGalleries.push(photoshoot)
          else if (photoshoot.isPublished) responseBody.privateGalleries.push(photoshoot)
          else responseBody.unpublishedGalleries.push(photoshoot)
        })
        res.json(responseBody)
      }
    })
})

server.get("/users/all", authenticated, privileged(2), (req, res) => {
  Admin.find({})
    .lean()
    .exec((err, result) => {
      if (err) res.sendStatus(500)
      else res.json(result)
    })
})

module.exports = server
