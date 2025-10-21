const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware"); // multer instance
const authMiddleware = require("../middleware/authMiddleware");
const verifyOwnership = require("../middleware/verifyOwnership");

router.get('/:id', authMiddleware, verifyOwnership, userController.getUserProfile);

router.get('/:id/basic', authMiddleware, verifyOwnership, userController.getBasicDetails);
router.put('/:id/basic', authMiddleware, verifyOwnership, userController.updateBasicDetails);

router.put('/:id/education', authMiddleware, verifyOwnership, userController.updateEducationDetails);
router.get('/:id/education', authMiddleware, verifyOwnership, userController.getEducationDetails);


router.put('/:id/family', authMiddleware, verifyOwnership, userController.updateFamilyDetails);
router.get('/:id/family', authMiddleware, verifyOwnership, userController.getFamilyDetails);

router.put('/:id/contact', authMiddleware, verifyOwnership, userController.updateContactDetails);
router.get('/:id/contact', authMiddleware, verifyOwnership, userController.getContactDetails);

router.put('/:id/partnerPreferences', authMiddleware, verifyOwnership, userController.updatePartnerPreferences);
router.get('/:id/partnerPreferences', authMiddleware, verifyOwnership, userController.getPartnerPreferences);


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
