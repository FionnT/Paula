const server = require("express")()
const cookieParser = require("cookie-parser")
const authenticated = require("./middleware/authenticated")()
const { Session } = require("../models/index")

server.use(cookieParser())

server.post("/shop/logout", authenticated, async (req, res) => {
  Session.findById(req.sessionID, (err, result) => {
    if (err) res.sendStatus(502)
    else if (result) {
      req.session.email = null
      result.deleteOne()
      res.sendStatus(200)
    }
  })
})

server.post("/admin/logout", authenticated, async (req, res) => {
  Session.findById(req.sessionID, (err, result) => {
    if (err) res.sendStatus(502)
    else if (result) {
      req.session.email = null
      result.deleteOne()
      res.sendStatus(200)
    }
  })
})

// server.post("/admin/logoutall", authenticated, async (req, res) => {
//   Session.deleteMany({}, (err, result) => {
//     if (err) res.sendStatus(502)
//     else if (result) {
//       result.deleteOne()
//       res.sendStatus(200)
//     }
//   })
// })

module.exports = server
