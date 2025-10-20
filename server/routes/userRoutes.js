const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware"); // multer instance
const authMiddleware = require("../middleware/authMiddleware");
const verifyOwnership = require("../middleware/verifyOwnership");

// Get user profile
router.get('/:id', authMiddleware, verifyOwnership, userController.getUserProfile);

// Update profile sections
router.put('/:id/basic', authMiddleware, verifyOwnership, userController.updateBasicDetails);
router.put('/:id/education', authMiddleware, verifyOwnership, userController.updateEducationDetails);
router.put('/:id/family', authMiddleware, verifyOwnership, userController.updateFamilyDetails);
router.put('/:id/contact', authMiddleware, verifyOwnership, userController.updateContactDetails);
router.put('/:id/partner-preference', authMiddleware, verifyOwnership, userController.updatePartnerPreferences);

// Upload photos (max 3)
router.put(
  "/:id/photos",
  authMiddleware,
  verifyOwnership,
  upload.array("photos", 3),
  userController.updatePhotos
);

// ✅ New routes

// Get all photos of a user
router.get("/:id/photos", authMiddleware, verifyOwnership, userController.getUserPhotos);

// Delete a specific photo
router.delete("/:id/photos", authMiddleware, verifyOwnership, userController.deletePhoto);

module.exports = router;
