const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage config: dynamic folder per user
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            // Ensure user ID exists (from auth middleware)
            const userId = req.user?.id;
            if (!userId) throw new Error("User ID not found in request");

            // Path: /uploads/users/<userId>/
            const dir = path.join(__dirname, "../uploads/users", userId);

            // Create folder if it doesn't exist
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            cb(null, dir);
        } catch (err) {
            cb(err, "");
        }
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp + random number + original extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter: allow only image files
const fileFilter = (req, file, cb) => {
    // 1. Check MIME type (preferred method)
    const isMimeTypeAllowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ].includes(file.mimetype);

    // 2. Check File Extension (fallback for ambiguous mobile uploads)
    const ext = path.extname(file.originalname).toLowerCase();
    const isExtensionAllowed = ['.jpeg', '.jpg', '.png', '.webp'].includes(ext);

    // Allow if EITHER the MIME type OR the extension is correct
    // This fixes the issue where mobile clients send generic MIME types
    if (isMimeTypeAllowed || isExtensionAllowed) {
        cb(null, true); // Accept file
    } else {
        // Reject file
        cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"), false);
    }
};

// Create multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload;
