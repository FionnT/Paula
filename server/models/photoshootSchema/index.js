const Schema = require("../schema")
const photoshootSchema = new Schema(
  {
    itemOrder: Array,
    length: Number,
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
      type: Boolean, // Boolean so we don't have to send the password to the user
      default: false
    },
    password: {
      type: String,
      default: undefined,
      select: false
    },
    url: {
      type: String,
      lowercase: true
    },
    __v: {
      type: Number,
      select: false
    }
  },
  { collection: "photoshoots" }
)

module.exports = photoshootSchema
