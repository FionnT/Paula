const Schema = require("../schema")
const adminSchema = new Schema(
  {
    email: String,
    name: String,
    password: {
      type: String,
      select: false
    },
    privileges: {
      type: Number,
      default: 3
    },
    filename: String
  },
  { collection: "admins" }
)

module.exports = adminSchema
