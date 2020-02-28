const server = require("express")()
const session = require("express-session")
const jsonParser = require("body-parser").json()
const MongoDBStore = require("connect-mongodb-session")(session)
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const maxSessionLength = 1000 * 60 * 60 * 8 // 8 hours
const store = new MongoDBStore(
  {
    uri: "mongodb://localhost:27017/paula",
    collection: "sessions"
  },
  err => {
    if (err) console.log(err)
  }
)
const { Admin, Person } = require("../models/index")

server.use(cookieParser())

server.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: maxSessionLength,
      httpOnly: false,
      secure: false,
      sameSite: "none"
    },
    store: store,
    resave: true,
    saveUninitialized: true
  })
)

server.post("/shop/login", jsonParser, async (req, res) => {
  const { email, password } = req.body
  await Person.findOne({ email }, (err, user) => {
    if (err) res.sendStatus(503)
    else if (!user) res.sendStatus(403)
    else {
      bcrypt.compare(password, user.password, (err, success) => {
        if (err) res.sendStatus(502)
        else if (!success) res.sendStatus(403)
        else {
          req.session.email = user.email
          res.sendStatus(200)
        }
      })
    }
  })
})

server.post("/admin/login", jsonParser, async (req, res) => {
  const { email, password } = req.body
  await Admin.findOne({ email }, (err, user) => {
    if (err) res.sendStatus(503)
    else if (!user) res.sendStatus(403)
    else {
      bcrypt.compare(password, user.password, (err, success) => {
        if (err) console.log(err)
        else if (!success) res.sendStatus(403)
        else {
          req.session.email = user.email
          res.sendStatus(200)
        }
      })
    }
  })
})

module.exports = server
