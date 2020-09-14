const { Session } = require("../../models")

const authenticated = () => {
  return (req, res, next) => {
    Session.findById(req.sessionID)
      .lean() // converts mongoose document to JSON
      .exec((err, result) => {
        console.log(req.sessionID)
        if (err) console.log(err)
        else if (result) {
          res.locals.email = result.session.email
          res.locals.privileges = result.session.privileges
          next()
        } else res.sendStatus(401)
      })
  }
}

module.exports = authenticated
