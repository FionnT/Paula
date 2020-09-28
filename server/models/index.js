const adminSchema = require("./adminSchema")
const orderSchema = require("./orderSchema")
const photoshootSchema = require("./photoshootSchema")
const userSchema = require("./userSchema")
const sessionSchema = require("./sessionSchema")
const storeItemSchema = require("./storeItemSchema")

const mongoose = require("mongoose")

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
