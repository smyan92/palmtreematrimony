const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================================================
    // 🔹 LOGIN DETAILS
    // ======================================================
    login: {
      mobileNo: { type: String, required: true, unique: true },
      fullName: { type: String, required: true },
      password: { type: String, required: true },
    },

    // ======================================================
    // 🔹 BASIC DETAILS
    // ======================================================
    basic: {
      fullName: { type: String },
      dob: { type: Date },
      homeTown: { type: String },
      religion: { type: String },
      subCaste: { type: String },
      rasi: { type: String },
      star: { type: String },
      skinColor: { type: String },
      height: { type: String },
      weight: { type: String },
      foodHabit: { type: String },
      motherTongue: { type: String },
      chevaiDosham: { type: String },
      goldWeight: { type: String },
      physicalChallenge: { type: String },
    },

    // ======================================================
    // 🔹 USER TYPE & PLAN
    // ======================================================
    userType: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    planType: {
      type: String,
      enum: ["premium", "normal"],
      default: "normal",
    },
    planDetails: {
      expiryDate: { type: Date },
      features: [{ type: String }],
    },

    // ======================================================
    // 🔹 EDUCATION & PROFESSIONAL DETAILS
    // ======================================================
    professional: {
      higherEducation: { type: String },
      jobTitle: { type: String },
      monthlySalary: { type: String },
      jobTown: { type: String },
    },

    // ======================================================
    // 🔹 FAMILY DETAILS
    // ======================================================
    family: {
      homeType: { type: String },
      hasLoan: { type: Boolean, default: false },
      hasCar: { type: Boolean, default: false },
      propertyDetails: { type: String },
      drinkingHabit: {
        type: String,
        enum: ["Never", "Occasionally", "Regularly", "Not Specified"],
        default: "Not Specified",
      },
    },

    // ======================================================
    // 🔹 CONTACT DETAILS
    // ======================================================
    contact: {
      mobile: { type: String },
      alternativeNumber: { type: String },
    },

    // ======================================================
    // 🔹 PARTNER PREFERENCES
    // ======================================================
    partnerPreferences: {
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
    },

    // ======================================================
    // 🔹 PHOTOS
    // ======================================================
    photos: {
      profilePhotoUrls: [{ type: String }],
      photoPrivacy: { type: String, enum: ["Public", "Private"], default: "Public" },
    },

    // ======================================================
    // 🔹 STATUS FLAGS
    // ======================================================
    status: {
      isProfileCompleted: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
