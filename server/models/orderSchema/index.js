const Schema = require("../schema")
const orderSchema = new Schema(
  {
    name: String,
    email: String,
    streetAddress: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    purchaseCost: Number,
    items: Array,
    status: {
      type: String,
      default: "pending"
    },
    orderID: String,
    chargeID: String,
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, default: undefined }
  },
  { collection: "orders" }
)

orderSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

module.exports = orderSchema
