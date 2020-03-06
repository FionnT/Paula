const server = require("express").Router()
const jsonParser = require("body-parser").json()
const busboy = require("connect-busboy")()

const privileged = require("./middleware/privileged")
const authenticated = require("./middleware/authenticated")()
const { Photoshoots } = require("../models/index")

server.post("/upload/json", authenticated, privileged(2), jsonParser, (req, res) => {
  return new Promise(resolve => {
    const Photoshoot = new Photoshoots(req.body)
    const url = req.body.url
    Photoshoots.findOne({ url }, (err, result) => {
      if (err) res.send(502)
      if (result) {
        Photoshoot.save()
          .then(res.sendStatus(200))
          .then(resolve())
      } else res.sendStatus(403)
    })
  })
})

server.post("/upload/json/update", jsonParser, (req, res) => {
  return new Promise(resolve => {
    const url = req.body.url
    Photoshoots.findOne({ url }, (err, result) => {
      if (err) res.send(502)
      if (result) {
        Object.assign(result, req.body)
        result
          .save()
          .then(res.sendStatus(200))
          .then(resolve())
      } else res.sendStatus(403)
    })
  })
})

server.post("/upload/images", authenticated, privileged(2), busboy, (req, res) => {
  // TODO - Make it save images
  // req.pipe(busboy)
  let url
  return new Promise(resolve => {
    const Photoshoot = new Photoshoots(req.body)
    Photoshoots.findOne({ url }, (err, result) => {
      if (err) res.sendStatus(502)
      if (result) {
        Photoshoot.save()
          .then(res.sendStatus(200))
          .then(resolve())
      } else res.sendStatus(403)
    })
  })
  // req.busboy.on("field")
})

module.exports = server
