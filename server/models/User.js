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
        enum: ["Never", "Occasionally", "Regularly"],
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
  partnerAgeFrom: { type: Number },
  partnerAgeTo: { type: Number },
  partnerMaritalStatus: {
    type: String,
    enum: ["Unmarried", "Divorced", "Widowed", "Separated", "Any", "Single", "Married"], // added Single, Married for frontend flexibility
    default: "Any",
  },
  partnerHometown: { type: String, trim: true },
  partnerJobTown: { type: [String], default: [] },
  partnerReligion: { type: String, trim: true },
  partnerSubcaste: { type: String, trim: true },
  partnerEducation: { type: String, trim: true },
  partnerJob: { type: String, trim: true },
  partnerSalary: { type: String, trim: true },
  partnerHometownMulti: { type: [String], default: [] },
  partnerChevai: { type: String, enum: ["Yes", "No", "Don't Know", "Any", "yes", "no"], default: "Any" }, // added lowercase
  partnerPhysicalChallenge: { type: String, enum: ["Yes", "No", "Any", "yes", "no"], default: "Any" }, // added lowercase
 partnerHouseType: { type: String },
  partnerGold: { type: String, trim: true },
  partnerSkinColor: { type: String, trim: true },
  partnerStarMulti: { type: [String], default: [] },
  partnerRasiMulti: { type: [String], default: [] },
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
