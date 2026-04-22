const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  className: String,
  imgUrl: String,
  educator: String,
  bookName: String,
  price: String,
  rating: String,
  bookLink: String,

 call: String,
  yt: String,
  tg: String,
  wa: String,
  ig: String,
  io: String
});

module.exports = mongoose.model("Book", bookSchema);