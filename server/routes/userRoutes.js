const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ==================== USER ROUTES ==================== //

// 👉 Get user profile
router.get('/:id', userController.getUserProfile);

// 👉 Update sections of user profile
router.put('/:id/basic', userController.updateBasicDetails);
router.put('/:id/education', userController.updateEducationDetails);
router.put('/:id/family', userController.updateFamilyDetails);
router.put('/:id/contact', userController.updateContactDetails);
router.put('/:id/partner-preference', userController.updatePartnerPreferences);

module.exports = router;
