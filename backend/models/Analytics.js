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

    // Analytics event type
    // click = button/link click
    // view = card view
    eventType: {
        type: String,
        enum: ["click", "view"],
        default: "click"
    },

    // Analytics event type
    // view / app / youtube / telegram / whatsapp / ios / website
    clickType: {
        type: String,
        required: false
    },

    visitorId: {
        type: String,
        default: ""
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