const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({

  className: String,

  imgUrl: String,

  imgUrl2: String,

  educator: String,

  exam: String,

  subject: String,

  appName: String,

  books: String,

  offer: String,

  appLink: String,

  demoVideo: String,

  yt: String,

  tg: String,

  wa: String,

  ig: String,

  io: String,

  wb: String

});

module.exports = mongoose.model("Class", classSchema);