const { Session } = require("../../models")

const authenticated = level => {
  return async (req, res, next) => {
    await Session.findById(req.sessionID, (err, result) => {
      if (err) res.sendStatus(502)
      else if (result) {
        req.session.email = result.cookie.email
        next()
      } else res.sendStatus(403)
    })
  }
}

module.exports = authenticated
