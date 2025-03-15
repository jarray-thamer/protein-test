const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Middleware for handling multiple file uploads
const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 }, // Single main image
  { name: "images", maxCount: 10 }, // Up to 10 additional images
]);

const uploadSlidesImages = upload.fields({ name: "images" });

module.exports = { upload, uploadProductImages, uploadSlidesImages };
