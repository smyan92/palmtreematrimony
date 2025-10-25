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



// userRoutes.js
// Ensure this line is exactly correct, including 'POST'
router.post(
  "/:id/allPhotos",
  authMiddleware,      // ⚠️ Check this middleware is running and calling next()
  verifyOwnership,     // ⚠️ Check this middleware is running and calling next()
  // Ensure 'upload' is imported and 'galleryPhotos' is the field name
  upload.array("galleryPhotos", 3), 
  userController.addGalleryPhotos
);

// Get ALL Photos (Gallery Photos)
router.get(
  "/:id/allPhotos",
  authMiddleware,
  verifyOwnership,
  userController.getAllPhotos
);

// Delete a specific photo from the ALL PHOTOS/Gallery collection
router.delete(
  "/:id/allPhotos",
  authMiddleware,
  verifyOwnership,
  userController.deleteGalleryPhoto
);

module.exports = router;
