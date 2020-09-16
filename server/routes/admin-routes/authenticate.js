const bcrypt = require("bcrypt")
const jsonParser = require("body-parser").json()
const server = require("express")()
const authenticated = require("../middleware/authenticated")()
const { Admin, Person } = require("../../models/index")

const public_metadata = {
  email: undefined,
  name: undefined,
  filename: undefined,
  privileges: undefined
}

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
// If we can't find a user registered with that email, we send a 401 which clears the user object on the client side
// This ensures that you need two components at all times to access an account
// 1. A password verified session per login route above
// 2. ConnectSID matching that of the veririfed session

server.get("/verify_session", jsonParser, authenticated, async (req, res) => {
  const { email, privileges } = res.locals
  if (privileges) {
    await Admin.findOne({ email }, (err, user) => {
      if (err) res.sendStatus(401)
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
      if (err) res.sendStatus(401)
      else if (!user) res.sendStatus(401)
      else {
        public_metadata.forEach(key => (public_metadata[key] = user[key]))
        res.json(public_metadata)
      }
    })
  } else res.json({ Reason: "User unauthorised" })
})

server.get("/logout", (req, res) => {
  req.session.destroy()
  res.end()
})

module.exports = server
