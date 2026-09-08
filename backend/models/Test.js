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

  wb: String,

  // =========================================
  // DRAFT / PUBLISH
  // =========================================
  status: {
    type: Boolean,
    default: true
  }

});

module.exports = mongoose.model("Test", testSchema);