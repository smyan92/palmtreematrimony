const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

// ==================== AUTH ROUTES ==================== //

// 👉 Register a new user
router.post('/register', auth.register);

// 👉 User login
router.post('/login', auth.login);

// 👉 Forgot-password Step 1: Request OTP
router.post('/request-otp', auth.requestOtp);

// 👉 Forgot-password Step 2: Reset password using OTP
router.post('/reset-password', auth.resetPassword);

// ====================================================== //
module.exports = router;
