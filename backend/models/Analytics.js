const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({

    // कोणत्या class वर click झाला
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: false
    },

    // Class information
    className: {
        type: String,
        default: ""
    },

    educator: {
        type: String,
        default: ""
    },

    exam: {
        type: String,
        default: ""
    },

    subject: {
        type: String,
        default: ""
    },

    // कोणत्या button वर click झाला
    // app / youtube / telegram / whatsapp / ios / website
    clickType: {
        type: String,
        required: true
    },

    // Click कधी झाला
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: false
});


module.exports =
    mongoose.model("Analytics", analyticsSchema);