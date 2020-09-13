const { Admin } = require("../../models")

const privileged = level => {
  return async (req, res, next) => {
    await Admin.findOne({ email: req.session.email })
      .lean()
      .exec((err, admin) => {
        if (err) res.sendStatus(502)
        else if (admin && admin.privileges >= level) next()
        else res.sendStatus(403)
      })
  }
}

module.exports = privileged
