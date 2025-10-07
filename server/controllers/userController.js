const User = require('../models/User');

// ==================== Get User Profile ====================
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetOtpHash -resetOtpExpiry');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Update Basic Details ====================
exports.updateBasicDetails = async (req, res) => {
  const {
    fullName,
    dob,
    homeTown,
    religion,
    subCaste,
    rasi,
    star,
    skinColor,
    height,
    weight,
    foodHabit,
    motherTongue,
    chevaiDosham,
    goldWeight,
    physicalChallenge,
    profilePhotoUrls,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        dob,
        homeTown,
        religion,
        subCaste,
        rasi,
        star,
        skinColor,
        height,
        weight,
        foodHabit,
        motherTongue,
        chevaiDosham,
        goldWeight,
        physicalChallenge,
        profilePhotoUrls,
        isProfileCompleted: true,
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Basic details updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Update Education Details ====================
exports.updateEducationDetails = async (req, res) => {
  const { higherEducation, jobTitle, monthlySalary, jobTown } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { higherEducation, jobTitle, monthlySalary, jobTown },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Education details updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Update Family Details ====================
exports.updateFamilyDetails = async (req, res) => {
  const { homeType, hasLoan, hasCar, propertyDetails, drinkingHabit } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { homeType, hasLoan, hasCar, propertyDetails, drinkingHabit },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Family details updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Update Contact Details ====================
exports.updateContactDetails = async (req, res) => {
  const { mobile, alternativeNumber } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { mobile, alternativeNumber },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Contact details updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== Update Partner Preferences ====================
exports.updatePartnerPreferences = async (req, res) => {
  const {
    partnerName,
    partnerAgeFrom,
    partnerAgeTo,
    partnerMaritalStatus,
    partnerHometown,
    partnerJobTown,
    partnerReligion,
    partnerSubcaste,
    partnerEducation,
    partnerJob,
    partnerSalary,
    partnerHometownMulti,
    partnerChevai,
    partnerPhysicalChallenge,
    partnerHouseType,
    partnerGold,
    partnerSkinColor,
    partnerStarMulti,
    partnerRasiMulti,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        partnerName,
        partnerAgeFrom,
        partnerAgeTo,
        partnerMaritalStatus,
        partnerHometown,
        partnerJobTown,
        partnerReligion,
        partnerSubcaste,
        partnerEducation,
        partnerJob,
        partnerSalary,
        partnerHometownMulti,
        partnerChevai,
        partnerPhysicalChallenge,
        partnerHouseType,
        partnerGold,
        partnerSkinColor,
        partnerStarMulti,
        partnerRasiMulti,
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Partner preferences updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
