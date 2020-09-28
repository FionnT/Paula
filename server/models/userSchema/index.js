const Schema = require("../schema")

const userSchema = new Schema(
  {
    email: String,
    name: String,
    password: String,
    addressOne: String,
    addressTwo: String,
    city: String,
    postCode: String,
    country: String,
    orderIDs: Array
  },
  { collection: "users" }
)

module.exports = userSchema
