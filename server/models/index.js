const mongoose = require("mongoose")

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/paula", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const Schema = mongoose.Schema

const adminSchema = new Schema(
  {
    email: String,
    name: String,
    password: String,
    privileges: {
      type: Number,
      default: 3
    },
    filename: String
  },
  { collection: "admins" }
)

const orderSchema = new Schema(
  {
    items: Array,
    name: String,
    streetAddress: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    purchaseCost: Number,
    email: String,
    orderID: String,
    createdAt: { type: Date, default: Date.now },
    expireAt: { type: Date, default: undefined }
  },
  { collection: "orders" }
)

orderSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

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
sessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 14400 }) // 4 hours

const storeItemSchema = new Schema(
  {
    UUID: String, // names are not unique here, so we need a UUID to avoid duplicates
    image: String,
    isPublished: Boolean,
    name: String,
    sizes: Array // This expects an array of JSON objects as such: {"measurements": "30 x 30", "type" : "tile", "cost": 30}
  },
  { collection: "StoreItems" }
)

const photoshootSchema = new Schema(
  {
    itemOrder: Array,
    length: String,
    isInHomePosition: Number,
    isOnHomeScreen: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    title: String,
    isPasswordProtected: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: undefined,
      select: false
    },
    url: String,
    __v: {
      type: Number,
      select: false
    }
  },
  { collection: "photoshoots" }
)

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

const Admin = mongoose.model("Admin", adminSchema)
const Order = mongoose.model("confirmedOrder", orderSchema)
const Photoshoots = mongoose.model("Photoshoots", photoshootSchema)
const Person = mongoose.model("Person", userSchema)
const Session = mongoose.model("Session", sessionSchema)
const StoreItems = mongoose.model("StoreItem", storeItemSchema)

module.exports = {
  Admin,
  Order,
  Photoshoots,
  Person,
  Session,
  StoreItems
}
