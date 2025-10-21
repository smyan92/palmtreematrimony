const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const updatePhotos = async (req, res) => {
  try {
    const userId = req.params.id;
    const { photoPrivacy } = req.body;

    // Check for file upload failure
    if (!req.files || req.files.length === 0) {
      // If no files were uploaded, but a privacy change was intended, handle that
      if (photoPrivacy) {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.photos.photoPrivacy = photoPrivacy;
        await user.save();
        return res.status(200).json({
          message:
            "Photo privacy updated successfully (no new photo uploaded).",
          photos: user.photos,
        });
      }
      return res.status(400).json({ message: "No photos uploaded" });
    }

    // 1. Get relative paths for the new files
    const newFileUrls = req.files.map(
      (file) => `/uploads/users/${userId}/${file.filename}`
    );
    // NOTE: I've added '/users/${userId}/' to the path based on typical user-specific uploads.
    // Adjust '/uploads/...' path based on your Multer configuration.

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. CONCATENATE the new URLs with the existing ones
    let updatedUrls = [
      ...(user.photos.profilePhotoUrls || []), // Use existing photos
      ...newFileUrls, // Add the new photos
    ];

    // 3. Optional: Enforce MAX_PHOTOS limit (e.g., if MAX_PHOTOS is 3)
    // If you need to enforce a limit, this logic should be applied:
    // const MAX_PHOTOS = 3;
    // if (updatedUrls.length > MAX_PHOTOS) {
    //    // Implement logic: either slice, or reject the upload earlier with a 400 error
    //    // For simplicity, we'll keep the full array unless you implement a check
    // }

    // 4. Save the updated list and privacy status
    user.photos.profilePhotoUrls = updatedUrls;
    user.photos.photoPrivacy =
      photoPrivacy || user.photos.photoPrivacy || "Public";

    await user.save();

    // 5. Send back the newly updated photo data
    res.status(200).json({
      message: "New photos added successfully",
      newPhotoUrl: newFileUrls[0], // Return the first URL for easy client state update (if only one was uploaded)
      photos: user.photos,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error while uploading photos" });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const userId = req.params.id;
    const { photoUrl } = req.body; // e.g. "/uploads/users/xyz/filename.jpg"

    // --- Authentication/Authorization Check (Implicitly done by token middleware before this) ---

    const user = await User.findById(userId); // Use your actual Mongoose model
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1️⃣ Remove from DB
    user.photos.profilePhotoUrls = user.photos.profilePhotoUrls.filter(
      (url) => url !== photoUrl
    );
    await user.save();

    // 2️⃣ Remove from folder (FIXED PATH LOGIC)

    // Use path.resolve or path.join with process.cwd() for a more robust path.
    // Assuming your 'uploads' directory is at the project root, this is the safest way.

    // This resolves the full absolute path, starting from the current working directory,
    // and appending the relative photoUrl received from the client.
    const filePath = path.join(process.cwd(), photoUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      // console.log(`Successfully deleted file: ${filePath}`); // Optional logging
    } else {
      // It's good practice to log if the file is missing, but continue since the DB is clean
      console.warn(`File not found on disk, but removed from DB: ${filePath}`);
    }

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Error deleting photo:", err);
    res.status(500).json({ message: "Error deleting photo" });
  }
};

const getUserPhotos = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      photos: user.photos,
    });
  } catch (error) {
    console.error("Get photos error:", error);
    res.status(500).json({ message: "Server error while fetching photos" });
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
      physicalChallenge:
        data.physicalChallenge ?? user.basic?.physicalChallenge,
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

const getBasicDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching basic details for user:", userId);

    // ✅ Find user and return only the 'basic' field
    const user = await User.findById(userId).select("basic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return basic details safely
    res.status(200).json({
      message: "Basic details fetched successfully",
      basicDetails: user.basic || {},
    });
  } catch (err) {
    console.error("Get Basic Details Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
      higherEducation:
        data.higherEducation ?? user.professional?.higherEducation,
      jobTitle: data.jobTitle ?? user.professional?.jobTitle,
      monthlySalary: data.monthlySalary ?? user.professional?.monthlySalary,
      jobTown: data.jobTown ?? user.professional?.jobTown,
    };

    user.status.isEducationCompleted = true;
    await user.save();

    res.json({ message: "Education & job details updated successfully", user });
  } catch (err) {
    console.error("Error in updateEducationDetails:", err);
    res
      .status(500)
      .json({ message: "Server error while updating education details" });
  }
};

const getEducationDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching education details for user:", userId);

    // ✅ Find user and return only the 'basic' field
    const user = await User.findById(userId).select("professional");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return basic details safely
    res.status(200).json({
      message: "education details fetched successfully",
      educationDetails: user.professional || {},
    });
  } catch (err) {
    console.error("Get Basic Details Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== Update Family Details ====================
const updateFamilyDetails = async (req, res) => {
  const data = req.body;
  try {
    // 1. Find the User
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Apply updates using spread and nullish coalescing (??)
    // This is the clean, robust way to update an embedded document.
    user.family = {
      // Keep existing family fields that are not explicitly provided in 'data'
      ...user.family, 
      
      // Update fields: use data.field if it's not null/undefined, otherwise keep existing/default
      homeType: data.homeType ?? user.family?.homeType,
      
      // Booleans: ?? is crucial here. If data.hasLoan is NOT sent, it keeps user.family.hasLoan.
      // If it IS sent as false, it correctly updates to false.
      hasLoan: data.hasLoan ?? user.family?.hasLoan,
      hasCar: data.hasCar ?? user.family?.hasCar,
      
      propertyDetails: data.propertyDetails ?? user.family?.propertyDetails,
      
      // Enum field update
      drinkingHabit: data.drinkingHabit ?? user.family?.drinkingHabit,
    };

    // 3. Save the document
    await user.save();

    // 4. Respond with success
    res.json({ message: "Family details updated successfully", familyDetails: user.family });
  } catch (err) {
    console.error("Update Family Details Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getFamilyDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching family details for user:", userId);

    // ✅ Find user and return only the 'basic' field
    const user = await User.findById(userId).select("family");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return basic details safely
    res.status(200).json({
      message: "family details fetched successfully",
      familyDetails: user.family || {},
    });
  } catch (err) {
    console.error("Get family Details Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateContactDetails = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.contact.mobile = data.mobile ?? user.contact.mobile;
    user.contact.alternativeNumber =
      data.alternativeNumber ?? user.contact.alternativeNumber;

    await user.save();
    res.json({ message: "Contact details updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getContactDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching contact details for user:", userId);

    // ✅ Find user and return only the 'basic' field
    const user = await User.findById(userId).select("contact");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return basic details safely
    res.status(200).json({
      message: "contact details fetched successfully",
      contactDetails: user.contact || {},
    });
  } catch (err) {
    console.error("Get contact Details Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updatePartnerPreferences = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Helper to ensure array fields
    const ensureArray = (value, fallback) =>
      Array.isArray(value) ? value : fallback;

    // Enum normalization helper (case-insensitive)
    const normalizeEnum = (value, validValues, fallback) => {
      if (!value) return fallback;
      const found = validValues.find(
        (v) => v.toLowerCase() === value.toString().toLowerCase()
      );
      return found || fallback;
    };

    // Define enum values exactly as in your updated schema
    const maritalStatusEnum = ["Unmarried", "Divorced", "Widowed", "Separated", "Any", "Single", "Married"];
    const chevaiEnum = ["Yes", "No", "Don't Know", "Any", "yes", "no"];
    const physicalChallengeEnum = ["Yes", "No", "Any", "yes", "no"];

    // Safely merge existing preferences with new data
    user.partnerPreferences = {
      ...(user.partnerPreferences || {}),

      partnerAgeFrom: data.partnerAgeFrom !== undefined ? Number(data.partnerAgeFrom) : user.partnerPreferences?.partnerAgeFrom,
      partnerAgeTo: data.partnerAgeTo !== undefined ? Number(data.partnerAgeTo) : user.partnerPreferences?.partnerAgeTo,
      partnerGold: data.partnerGold !== undefined ? String(data.partnerGold) : user.partnerPreferences?.partnerGold,

      partnerMaritalStatus: normalizeEnum(
        data.partnerMaritalStatus,
        maritalStatusEnum,
        user.partnerPreferences?.partnerMaritalStatus || "Any"
      ),
      partnerChevai: normalizeEnum(
        data.partnerChevai,
        chevaiEnum,
        user.partnerPreferences?.partnerChevai || "Any"
      ),
      partnerPhysicalChallenge: normalizeEnum(
        data.partnerPhysicalChallenge,
        physicalChallengeEnum,
        user.partnerPreferences?.partnerPhysicalChallenge || "Any"
      ),
       partnerHouseType: data.partnerHouseType ?? user.partnerPreferences?.partnerHouseType,
      partnerHometown: data.partnerHometown?.trim() || user.partnerPreferences?.partnerHometown,
      partnerJobTown: ensureArray(data.partnerJobTown, user.partnerPreferences?.partnerJobTown),
      partnerReligion: data.partnerReligion?.trim() || user.partnerPreferences?.partnerReligion,
      partnerSubcaste: data.partnerSubcaste?.trim() || user.partnerPreferences?.partnerSubcaste,
      partnerEducation: data.partnerEducation?.trim() || user.partnerPreferences?.partnerEducation,
      partnerJob: data.partnerJob?.trim() || user.partnerPreferences?.partnerJob,
      partnerSalary: data.partnerSalary?.trim() || user.partnerPreferences?.partnerSalary,
      partnerHometownMulti: ensureArray(data.partnerHometownMulti, user.partnerPreferences?.partnerHometownMulti),
      partnerSkinColor: data.partnerSkinColor?.trim() || user.partnerPreferences?.partnerSkinColor,
      partnerStarMulti: ensureArray(data.partnerStarMulti, user.partnerPreferences?.partnerStarMulti),
      partnerRasiMulti: ensureArray(data.partnerRasiMulti, user.partnerPreferences?.partnerRasiMulti),
    };

    // Mark preferences as completed
    user.status = { ...user.status, isPartnerPreferenceCompleted: true };

    await user.save();
    res.json({ message: "Partner preferences updated successfully", user });
  } catch (err) {
    console.error("Update Partner Preferences Error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: err.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};


const getPartnerPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching partner-preference details for user:", userId);

    // ✅ Find user and return only the 'basic' field
    const user = await User.findById(userId).select("partnerPreferences");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return basic details safely
    res.status(200).json({
      message: "partner-preference details fetched successfully",
      partnerPreferenceDetails: user.partnerPreferences || {},
    });
  } catch (err) {
    console.error("Get partner-preference Details Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  updatePhotos,
  getUserProfile,
 
  updateBasicDetails,
  getBasicDetails,
 
  updateEducationDetails,
  getEducationDetails,
 
  updateFamilyDetails,
  getFamilyDetails,
  
  updateContactDetails,
  getContactDetails,

  updatePartnerPreferences,
  getPartnerPreferences,

  getUserPhotos,
  deletePhoto,
};
