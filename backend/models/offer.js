const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    offerTitle: {
      type: String,
      required: true
    },

    festival: {
      type: String,
      default: ""
    },

    discount: {
      type: String,
      default: ""
    },

    couponCode: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    validFrom: {
      type: Date,
      required: true
    },

    validTill: {
      type: Date,
      required: true
    },

    applicableTo: {
      type: String,
      enum: ["classes", "tests", "books", "all"],
      required: true
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ],

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Offer", offerSchema);