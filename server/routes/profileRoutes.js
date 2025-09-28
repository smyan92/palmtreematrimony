const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); 

// /api/v1/profile-ன் கீழ் வரும் அனைத்து வழிகளுக்கும் அங்கீகாரம் தேவை
router.use(authMiddleware.protect);

// POST: புதிய சுயவிவரத்தை உருவாக்க
// PUT: ஏற்கனவே உள்ள சுயவிவரத்தை புதுப்பிக்க
// GET: உள்நுழைந்த பயனரின் சொந்த சுயவிவரத்தைப் பெற
router.route('/')
    .post(profileController.createOrUpdateProfile) 
    .put(profileController.createOrUpdateProfile) 
    .get(profileController.getOwnProfile);

// புகைப்படங்களை பதிவேற்றுவதற்கான வழி (Middleware-ஐ பயன்படுத்த)
router.post('/photos', profileController.uploadProfilePhoto);

module.exports = router;
