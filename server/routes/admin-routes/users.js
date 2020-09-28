const server = require("express")()
const jsonParser = require("body-parser").json()
const bcrypt = require("bcrypt")
const saltRounds = 10

const privileged = require("../middleware/privileged")
const authenticated = require("../middleware/authenticated")()

const { Admin } = require("../../models/index")

server.post("/admin/register", authenticated, privileged(1), jsonParser, async (req, res) => {
  const { email, password } = req.body
  await Admin.findOne({ email }, (err, result) => {
    if (err) res.sendStatus(502)
    else if (result) res.sendStatus(403)
    else {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) res.sendStatus(502)
        else {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) res.sendStatus(502)
            else {
              req.body.password = hash
              let uAdmin = new Admin(req.body)
              uAdmin
                .save()
                .then(res.sendStatus(200))
                .catch(err => {
                  console.log(err)
                  res.sendStatus(502)
                })
            }
          })
        }
      })
    }
  })
})

server.get("/admin/users", authenticated, privileged(1), async (req, res) =>
  Admin.find({})
    .lean()
    .exec((err, result) => {
      if (err) res.sendStatus(502)
      else if (result) res.json(result)
      else res.sendStatus(500)
    })
)

server.post("/admin/users/update", authenticated, privileged(1), jsonParser, async (req, res) => {
  const update = req.body
  await Admin.findById(update._id, (err, result) => {
    if (err) res.sendStatus(404)
    else if (result) {
      if (res.locals.privileges >= result.privileges) {
        Object.assign(result, update)
        result.save().then(res.json(result))
      } else res.sendStatus(403)
    } else res.sendStatus(500)
  })
})

server.post("/admin/users/delete", authenticated, privileged(2), jsonParser, async (req, res) => {
  const update = req.body
  await Admin.findOneAndDelete({ _id: update.UUID }, (err, result) => {
    if (err) res.sendStatus(404)
    else if (result) res.sendStatus(200)
    else res.sendStatus(500)
  })
})

module.exports = server
