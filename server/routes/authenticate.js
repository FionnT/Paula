const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jsonParser = require("body-parser").json()
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const server = require("express")()
const store = new MongoDBStore(
  {
    uri: "mongodb://localhost:27017/paula",
    collection: "sessions"
  },
  err => {
    if (err) console.log(err)
  }
)

const authenticated = require("./middleware/authenticated")()
const { Admin, Person, Session } = require("../models/index")
const maxSessionLength = 1000 * 60 * 60 * 8 // 8 hours
const public_metadata = {
  email: undefined,
  name: undefined,
  filename: undefined,
  privileges: undefined
}

server.use(cookieParser())

server.use(
  session({
    secret: process.env.LOGIN_SECRET,
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
          for (let key in public_metadata) {
            public_metadata[key] = user[key]
          }
          req.session.email = user.email
          req.session.privileges = user.privileges
          req.session.save()
          res.json(public_metadata)
        }
      })
    }
  })
})

server.post("/admin/login", jsonParser, async (req, res) => {
  const { email, password } = req.body
  await Admin.findOne({ email }, (err, user) => {
    if (err) console.log(err)
    else if (!user) res.sendStatus(400)
    else {
      bcrypt.compare(password, user.password, (err, success) => {
        if (err) console.log(err)
        else if (!success) res.sendStatus(403)
        else {
          for (let key in public_metadata) {
            public_metadata[key] = user[key]
          }
          req.session.email = user.email
          req.session.privileges = user.privileges
          req.session.save()
          res.json(public_metadata)
        }
      })
    }
  })
})

// The authenticated middleware will tell us if we have an active session for this connectSID
// If we do, we will assign the res.locals object with the email relating to that SID
// We then send a response containing the public metadata of the email address tied to that connectSID
// If we can't find a user registered with that email, such as if they've just been deleted, we send a blank response
// This ensures that you need two keys at all times to access an account
// 1. Password verified session per above
// 2. ConnectSID matching that of the veririfed session

server.get("/verify_session", jsonParser, authenticated, async (req, res) => {
  const { email, privileges } = res.locals
  if (privileges) {
    await Admin.findOne({ email }, (err, user) => {
      if (err) res.sendStatus(503)
      else if (!user) res.sendStatus(401)
      else {
        for (let key in public_metadata) {
          public_metadata[key] = user[key]
        }
        res.json(public_metadata)
      }
    })
  } else if (!privileges) {
    await Person.findOne({ email }, (err, user) => {
      if (err) res.sendStatus(503)
      else if (!user) res.sendStatus(401)
      else {
        for (let key in public_metadata) {
          public_metadata[key] = user[key]
        }
        res.json(public_metadata)
      }
    })
  } else res.sendStatus(401)
})

server.get("/logout", (req, res) => {
  req.session.destroy()
  res.end()
})

module.exports = server
