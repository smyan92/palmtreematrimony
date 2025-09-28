const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { mobileNo, fullName, password } = req.body;

  try {
    const existingUser = await User.findOne({ mobileNo });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      mobileNo,
      fullName,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        mobileNo: user.mobileNo,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// server/controllers/authController.js
exports.login = async (req, res) => {
  const { mobileNo, password } = req.body;

  try {
    const user = await User.findOne({ mobileNo });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, mobileNo: user.mobileNo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        mobileNo: user.mobileNo,
        fullName: user.fullName
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.requestOtp = async (req, res) => {
  // We extract 'mobileNo' from the request body
  const { mobileNo } = req.body;
  
  try {
    // --- FIX APPLIED HERE ---
    // Query the database by searching the 'username' field for the mobile number value.
    const user = await User.findOne({mobileNo });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Assuming 'bcrypt' is imported and available
    const otpHash = await bcrypt.hash(otp, 10); 

    user.resetOtpHash = otpHash;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

    // TODO: Send OTP via SMS or email service (e.g., Twilio, Firebase)
    console.log(`OTP generated for ${mobileNo}:`, otp); // IMPORTANT: Never log this in production

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Request OTP Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  const { mobileNo, otp, newPassword } = req.body;
  
  try {
    // --- FIX APPLIED HERE ---
    // Query the database by searching the 'username' field for the mobile number value.
    const user = await User.findOne({ mobileNo }); 
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Check if OTP is requested and not expired
    if (!user.resetOtpHash || user.resetOtpExpiry < Date.now()) {
      // Clear expired hashes defensively
      user.resetOtpHash = undefined;
      user.resetOtpExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'OTP expired or not requested' });
    }

    // 2. Compare OTP with stored hash
    const isMatch = await bcrypt.compare(otp, user.resetOtpHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // 3. Update the password (Hashed) and clear OTP fields
    // Ensure the new password meets security requirements (e.g., minimum length) before saving
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = undefined; // Clear hash immediately after successful use
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
