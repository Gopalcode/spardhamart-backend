const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  className: String,
  exam: String,
  subject: String,
  appName: String,
  offer: String,
  appLink: String,
  imgUrl: String,
  yt: String,
  tg: String,
  wa: String,
  io: String,
  wb: String
});

module.exports = mongoose.model("Test", testSchema);