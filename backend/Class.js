const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: String,
  imgUrl: String,
  educator: String,
  exam: String,
  subject: String,
  appName: String,
  books: String,
  offer: String,
  appLink: String,
  yt: String,
  demoVideo:String,
  tg: String,
  wa: String,
  ig: String,
  io:String,
  wb:String
});

module.exports = mongoose.model("Class", classSchema);