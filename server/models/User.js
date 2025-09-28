const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileNo: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  resetOtpHash: { type: String },      // new
  resetOtpExpiry: { type: Number },    // timestamp
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
