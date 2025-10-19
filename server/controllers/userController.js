const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const updatePhotos = async (req, res) => {
  try {
    const userId = req.params.id;
    const { photoPrivacy } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No photos uploaded" });
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.photos.profilePhotoUrls = fileUrls;
    user.photos.photoPrivacy = photoPrivacy || "Public";
    await user.save();

    res.status(200).json({
      message: "Photos uploaded successfully",
      photos: user.photos,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error while uploading photos" });
  }
};



// ==================== Get User Profile ====================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-login.password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Basic Details ====================
const updateBasicDetails = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.basic = {
      ...user.basic,
      fullName: data.fullName ?? user.basic?.fullName,
      dob: data.dob ?? user.basic?.dob,
      homeTown: data.homeTown ?? user.basic?.homeTown,
      religion: data.religion ?? user.basic?.religion,
      subCaste: data.subCaste ?? user.basic?.subCaste,
      rasi: data.rasi ?? user.basic?.rasi,
      star: data.star ?? user.basic?.star,
      skinColor: data.skinColor ?? user.basic?.skinColor,
      height: data.height ?? user.basic?.height,
      weight: data.weight ?? user.basic?.weight,
      foodHabit: data.foodHabit ?? user.basic?.foodHabit,
      motherTongue: data.motherTongue ?? user.basic?.motherTongue,
      chevaiDosham: data.chevaiDosham ?? user.basic?.chevaiDosham,
      goldWeight: data.goldWeight ?? user.basic?.goldWeight,
      physicalChallenge: data.physicalChallenge ?? user.basic?.physicalChallenge,
      profilePhotoUrls: data.profilePhotoUrls ?? user.basic?.profilePhotoUrls,
    };

    user.status = { ...user.status, isProfileCompleted: true };
    await user.save();

    res.json({ message: "Basic details updated successfully", user });
  } catch (err) {
    console.error("Update Basic Details Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Education Details ====================
const updateEducationDetails = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.professional = {
      ...user.professional,
      higherEducation: data.higherEducation ?? user.professional?.higherEducation,
      jobTitle: data.jobTitle ?? user.professional?.jobTitle,
      monthlySalary: data.monthlySalary ?? user.professional?.monthlySalary,
      jobTown: data.jobTown ?? user.professional?.jobTown,
    };

    user.status.isEducationCompleted = true;
    await user.save();

    res.json({ message: "Education & job details updated successfully", user });
  } catch (err) {
    console.error("Error in updateEducationDetails:", err);
    res.status(500).json({ message: "Server error while updating education details" });
  }
};

// ==================== Update Family Details ====================
const updateFamilyDetails = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (data.homeType !== undefined) user.family.homeType = data.homeType;
    if (data.hasLoan !== undefined) user.family.hasLoan = data.hasLoan;
    if (data.hasCar !== undefined) user.family.hasCar = data.hasCar;
    if (data.propertyDetails !== undefined) user.family.propertyDetails = data.propertyDetails;
    if (data.drinkingHabit !== undefined) user.family.drinkingHabit = data.drinkingHabit;

    await user.save();
    res.json({ message: "Family details updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Contact Details ====================
const updateContactDetails = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.contact.mobile = data.mobile ?? user.contact.mobile;
    user.contact.alternativeNumber = data.alternativeNumber ?? user.contact.alternativeNumber;

    await user.save();
    res.json({ message: "Contact details updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Partner Preferences ====================
const updatePartnerPreferences = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const p = user.partnerPreferences || {};
    Object.keys(data).forEach((key) => {
      p[key] = data[key] ?? p[key];
    });

    user.partnerPreferences = p;
    await user.save();
    res.json({ message: "Partner preferences updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updatePhotos,
  getUserProfile,
  updateBasicDetails,
  updateEducationDetails,
  updateFamilyDetails,
  updateContactDetails,
  updatePartnerPreferences,
};
