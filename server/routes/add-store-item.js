const { v4: uuidv4 } = require("uuid")
const server = require("express").Router()
const jsonParser = require("body-parser").json()
const busboy = require("connect-busboy")()

const privileged = require("./middleware/privileged")
const authenticated = require("./middleware/authenticated")()
const { StoreItems } = require("../models/index")

//, authenticated, privileged(2)
server.post("/store/upload/json", jsonParser, (req, res) => {
  return new Promise(resolve => {
    const StoreItem = new StoreItems(req.body)
    const extLocation = req.body.image.split(".").length - 1
    const extension = req.body.image.split(".")[extLocation]
    StoreItem.UUID = uuidv4()
    StoreItem.image = StoreItem.UUID + "." + extension
    StoreItem.save()
      .then(res.json({ UUID: StoreItem.UUID }))
      .then(resolve())
  })
})

server.post("/store/upload/update", authenticated, privileged(2), jsonParser, (req, res) => {
  return new Promise(resolve => {
    const GUID = req.body.url
    StoreItems.findOne({ GUID }, (err, result) => {
      if (err) res.send(502)
      if (result) {
        Object.assign(result, req.body)
        result.save().then(res.sendStatus(200)).then(resolve())
      } else res.sendStatus(403)
    })
  })
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
