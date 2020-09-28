const Schema = require("../schema")
const sessionSchema = new Schema(
  {
    _email: String,
    _id: String,
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, default: undefined },
    Session: Object
  },
  { collection: "sessions" }
)

module.exports = sessionSchema
