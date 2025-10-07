const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================================================
    // 🔹 LOGIN DETAILS
    // ======================================================
    mobileNo: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },

    // ======================================================
    // 🔹 EDUCATION & PROFESSIONAL DETAILS
    // ======================================================
    higherEducation: { type: String },
    jobTitle: { type: String },
    monthlySalary: { type: String },
    jobTown: { type: String },

    // ======================================================
    // 🔹 FAMILY DETAILS
    // ======================================================
    homeType: { type: String }, // e.g., "Own", "Rental", "Joint"
    hasLoan: { type: Boolean, default: false },
    hasCar: { type: Boolean, default: false },
    propertyDetails: { type: String },
    drinkingHabit: {
      type: String,
      enum: ["Never", "Occasionally", "Regularly", "Not Specified"],
      default: "Not Specified",
    },

    // ======================================================
    // 🔹 CONTACT DETAILS
    // ======================================================
    mobile: { type: String },
    alternativeNumber: { type: String },

    // ======================================================
    // 🔹 PARTNER PREFERENCES
    // ======================================================
    partnerName: { type: String },
    partnerAgeFrom: { type: Number },
    partnerAgeTo: { type: Number },
    partnerMaritalStatus: {
      type: String,
      enum: ["Unmarried", "Divorced", "Widowed", "Separated", "Any"],
      default: "Any",
    },
    partnerHometown: { type: String },
    partnerJobTown: [{ type: String }],
    partnerReligion: { type: String },
    partnerSubcaste: { type: String },
    partnerEducation: { type: String },
    partnerJob: { type: String },
    partnerSalary: { type: String },
    partnerHometownMulti: [{ type: String }],
    partnerChevai: { type: String, enum: ["Yes", "No", "Don't Know", "Any"], default: "Any" },
    partnerPhysicalChallenge: { type: String, enum: ["Yes", "No", "Any"], default: "Any" },
    partnerHouseType: { type: String },
    partnerGold: { type: String },
    partnerSkinColor: { type: String },
    partnerStarMulti: [{ type: String }],
    partnerRasiMulti: [{ type: String }],

    // ======================================================
    // 🔹 PHOTOS (optional)
    // ======================================================
    profilePhotoUrls: [{ type: String }],
    photoPrivacy: { type: String, enum: ["Public", "Private"], default: "Public" },

    // ======================================================
    // 🔹 STATUS FLAGS
    // ======================================================
    isProfileCompleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
