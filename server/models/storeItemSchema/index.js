const Schema = require("../schema")
const storeItemSchema = new Schema(
  {
    UUID: String, // names are not unique here, so we need a UUID to avoid duplicates
    image: String,
    isPublished: Boolean,
    name: String,
    sizes: Array // This expects an array of JSON objects as such: [{"measurements": "30 x 30", "type" : "tile", "cost": 30}]
  },
  { collection: "StoreItems" }
)

module.exports = storeItemSchema
