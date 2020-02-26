const { Admin } = require("../../models")

const privileged = level => {
  return async (req, res, next) => {
    await Admin.findOne({ email: req.session.email }, (err, admin) => {
      if (err) res.sendStatus(502)
      else if (admin && admin.priveleges < level) next()
      else res.sendStatus(403)
    })
  }
}

module.exports = privileged
