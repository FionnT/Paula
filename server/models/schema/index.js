const mongoose = require("mongoose")

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/paula", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const Schema = mongoose.Schema

module.exports = Schema
