const mongoose = require("mongoose")

mongoose.Promise = global.Promise

// mongoose.connect("mongodb://site:kseneU5ffzGUpZ3@ds161397.mlab.com:61397/heroku_6lgfsr4h", { useNewUrlParser: true });

mongoose.connect("mongodb://localhost:27017/paula", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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
    orderingUserEmail: String,
    addressOne: String,
    addressTwo: String,
    city: String,
    postCode: String,
    country: String,
    orderCost: String,
    orderItems: Array
  },
  { collection: "orders" }
)

const sessionSchema = new Schema(
  {
    _email: String,
    _id: String,
    expires: Date,
    Session: Object
  },
  { collection: "sessions" }
)

const storeItemSchema = new Schema(
  {
    UUID: String, // names are not unique here, so we need a GUID to avoid duplicates
    image: String,
    isPublished: Boolean,
    name: String,
    sizes: Array
  },
  { collection: "StoreItems" }
)

const storeItemCostSchema = new Schema(
  {
    tiles: Object,
    prints: Object
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
    passwordProtected: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: undefined
    },
    url: String
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
const Order = mongoose.model("Order", orderSchema)
const Photoshoots = mongoose.model("Photoshoots", photoshootSchema)
const Person = mongoose.model("Person", userSchema)
const Session = mongoose.model("Session", sessionSchema)
const StoreItems = mongoose.model("StoreItem", storeItemSchema)
const StoreItemCost = mongoose.model("StoreItemCost", storeItemCostSchema)

module.exports = {
  Admin,
  Order,
  Photoshoots,
  Person,
  Session,
  StoreItems,
  StoreItemCost
}
