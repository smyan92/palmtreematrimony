const User = require("../models/User");

// ==================== Get User Profile ====================
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-login.password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Photos ====================
exports.updatePhotos = async (req, res) => {
  const { profilePhotoUrls, photoPrivacy } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.photos = {
      profilePhotoUrls: profilePhotoUrls || user.photos?.profilePhotoUrls || [],
      photoPrivacy: photoPrivacy || user.photos?.photoPrivacy || "Public",
    };

    await user.save();
    res.json({ message: "Photos updated successfully", photos: user.photos });
  } catch (err) {
    console.error("Update Photos Error:", err);
    res.status(500).json({ message: "Server error while updating photos" });
  }
};

// ==================== Update Basic Details ====================
exports.updateBasicDetails = async (req, res) => {
  const {
    fullName, dob, homeTown, religion, subCaste, rasi, star,
    skinColor, height, weight, foodHabit, motherTongue,
    chevaiDosham, goldWeight, physicalChallenge, profilePhotoUrls
  } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.basic = {
      ...user.basic,
      fullName: fullName || user.basic?.fullName,
      dob: dob || user.basic?.dob,
      homeTown: homeTown || user.basic?.homeTown,
      religion: religion || user.basic?.religion,
      subCaste: subCaste || user.basic?.subCaste,
      rasi: rasi || user.basic?.rasi,
      star: star || user.basic?.star,
      skinColor: skinColor || user.basic?.skinColor,
      height: height || user.basic?.height,
      weight: weight || user.basic?.weight,
      foodHabit: foodHabit || user.basic?.foodHabit,
      motherTongue: motherTongue || user.basic?.motherTongue,
      chevaiDosham: chevaiDosham || user.basic?.chevaiDosham,
      goldWeight: goldWeight || user.basic?.goldWeight,
      physicalChallenge: physicalChallenge || user.basic?.physicalChallenge,
      profilePhotoUrls: profilePhotoUrls || user.basic?.profilePhotoUrls,
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
exports.updateEducationDetails = async (req, res) => {
  const { higherEducation, jobTitle, monthlySalary, jobTown } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.professional = {
      ...user.professional,
      higherEducation: higherEducation ?? user.professional?.higherEducation,
      jobTitle: jobTitle ?? user.professional?.jobTitle,
      monthlySalary: monthlySalary ?? user.professional?.monthlySalary,
      jobTown: jobTown ?? user.professional?.jobTown,
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
exports.updateFamilyDetails = async (req, res) => {
  const { homeType, hasLoan, hasCar, propertyDetails, drinkingHabit } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (homeType !== undefined) user.family.homeType = homeType;
    if (hasLoan !== undefined) user.family.hasLoan = hasLoan;
    if (hasCar !== undefined) user.family.hasCar = hasCar;
    if (propertyDetails !== undefined) user.family.propertyDetails = propertyDetails;
    if (drinkingHabit !== undefined) user.family.drinkingHabit = drinkingHabit;

    await user.save();
    res.json({ message: "Family details updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Contact Details ====================
exports.updateContactDetails = async (req, res) => {
  const { mobile, alternativeNumber } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.contact.mobile = mobile || user.contact.mobile;
    user.contact.alternativeNumber = alternativeNumber || user.contact.alternativeNumber;

    await user.save();
    res.json({ message: "Contact details updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== Update Partner Preferences ====================
exports.updatePartnerPreferences = async (req, res) => {
  const data = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const p = user.partnerPreferences;

    Object.keys(data).forEach((key) => {
      p[key] = data[key] ?? p[key];
    });

    await user.save();
    res.json({ message: "Partner preferences updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
