require("dotenv").config();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;


// =========================================
// CLOUDINARY CONFIGURATION
// =========================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// =========================================
// CLOUDINARY STORAGE
// =========================================

const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {
        folder: "spardha_mart/test_series",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ]
    }

});


// =========================================
// MULTER CLOUDINARY UPLOAD
// =========================================

const cloudinaryUpload = multer({
    storage: storage
});


module.exports = cloudinaryUpload;