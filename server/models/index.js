const mongoose = require("mongoose")

mongoose.Promise = global.Promise

// mongoose.connect("mongodb://site:kseneU5ffzGUpZ3@ds161397.mlab.com:61397/heroku_6lgfsr4h", { useNewUrlParser: true });

mongoose.connect("mongodb://localhost:27017/paula", {
  useNewUrlParser: true,
  useUnifiedTopology: true
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

const photoshootSchema = new Schema(
  {
    itemOrder: Array,
    length: String,
    isInHomePosition: Number, // -1 indicates false
    isOnHomeScreen: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    title: String,
    printAvailable: {
      type: Boolean,
      default: false
    },
    printItems: Array,
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

const orderSchema = new Schema(
  {
    orderingUser: String,
    addressOne: String,
    addressTwo: String,
    city: String,
    postCode: String,
    country: String,
    orderItems: Array
  },
  { collection: "orders" }
)

const sessionSchema = new Schema({ _id: String, cookie: Object }, { collection: "sessions" })

const Admin = mongoose.model("Admin", adminSchema)
const Photoshoots = mongoose.model("Photoshoots", photoshootSchema)
const Person = mongoose.model("Person", userSchema)
const Order = mongoose.model("Order", orderSchema)
const Session = mongoose.model("Session", sessionSchema)

module.exports = {
  Admin,
  Photoshoots,
  Person,
  Order,
  Session
}
