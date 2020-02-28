const { Session } = require("../../models")

const authenticated = level => {
  return (req, res, next) => {
    Session.findById(req.sessionID)
      .lean() // converts mongoose document to JSON
      .exec((err, result) => {
        if (err) console.log(err)
        else if (result && req.session.email === result.session.email) next()
        else res.sendStatus(403)
      })
  }
}

module.exports = authenticated
