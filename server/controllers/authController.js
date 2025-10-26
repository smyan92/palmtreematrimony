const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==================== REGISTER ====================
exports.register = async (req, res) => {
  try {
    const { mobileNo, fullName, password } = req.body;

    // 1. Basic validation
    if (!mobileNo || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedMobile = mobileNo.trim();
    const trimmedName = fullName.trim();

    // 2. Check if user already exists
    const existingUser = await User.findOne({ "login.mobileNo": trimmedMobile });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user (palmtreeId is initially missing/default)
  // திருத்தப்பட்ட User.create பகுதி

let user = await User.create({
    login: {
        mobileNo: trimmedMobile,
        fullName: trimmedName,
        password: hashedPassword,
    },
  
});
    // ----------------------------------------------------------------
    // 5. Custom ID உருவாக்குதல் மற்றும் சேமித்தல் (ADDING THE LOGIC HERE)
    // ----------------------------------------------------------------
    
    // a) MongoDB ID-யை ஸ்ட்ரிங்காக மாற்றுதல்
    const mongoIdString = user._id.toString(); 

    // b) கடைசி 6 இலக்கங்களைப் பெறுதல்
    const uniqueNumber = mongoIdString.slice(-6); 

    // c) Custom ID-யை உருவாக்குதல் (PT00 + unique number)
    const customUserId = "PT00" + uniqueNumber; // Example: PT00660554

    // d) டேட்டாபேஸில் Custom ID-யைப் புதுப்பித்தல்
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { palmtreeId: customUserId } },
      { new: true } // புதுப்பிக்கப்பட்ட ஆவணத்தை திரும்பப் பெற
    );
    
    // ----------------------------------------------------------------

    // 6. Success Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: updatedUser.palmtreeId, // Custom ID-யை இங்கே அனுப்புதல்
        mobileNo: updatedUser.login.mobileNo,
        fullName: updatedUser.login.fullName,
        userType: updatedUser.userType,
        planType: updatedUser.planType,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { mobileNo, password } = req.body;

  try {
    const user = await User.findOne({ "login.mobileNo": mobileNo });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.login.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, mobileNo: user.login.mobileNo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const primaryProfilePhoto = user.photos?.allPhotosUrls?.[0] || null;

    res.json({
      token,
      user: {
        id: user._id.toString(),
        mobileNo: user.login.mobileNo,
        fullName: user.login.fullName,
        userType: user.userType,
        planType: user.planType,
        profilePhotoUrl: primaryProfilePhoto,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== REQUEST OTP ====================
exports.requestOtp = async (req, res) => {
  const { mobileNo } = req.body;

  try {
    const user = await User.findOne({ "login.mobileNo": mobileNo });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    user.resetOtpHash = otpHash;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`OTP generated for ${mobileNo}: ${otp}`); // Remove in production

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Request OTP Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== RESET PASSWORD ====================
exports.resetPassword = async (req, res) => {
  const { mobileNo, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ "login.mobileNo": mobileNo });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check OTP
    if (!user.resetOtpHash || user.resetOtpExpiry < Date.now()) {
      user.resetOtpHash = undefined;
      user.resetOtpExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'OTP expired or not requested' });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtpHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    // Update password
    user.login.password = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
