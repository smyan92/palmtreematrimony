const mongoose = require("mongoose");

// ===================================
// 1. Define the Nested Schema FIRST
// ===================================
const userPhotosSchema = new mongoose.Schema({
    profilePhotoUrls: {
        type: [String],
        default: [], // 👈 Best Practice: default ஆக காலியான அரே
    },
    
    allPhotosUrls: {
        type: [String],
        default: [], // 👈 Best Practice: default ஆக காலியான அரே
    },
    
    photoPrivacy: {
        type: String,
        default: 'public', // 👈 Best Practice: default ஆக String மதிப்பு
    }
}, { _id: false });

// ===================================
// 2. Define the Main Schema
// ===================================
const userSchema = new mongoose.Schema(
    {
        // ======================================================
        // 🔹 LOGIN DETAILS
        // ======================================================
    
    palmtreeId: {
        type: String,
        required: false, // கட்டாயமில்லை, ஏனெனில் பதிவு செய்யும் போதுதான் இது உருவாக்கப்படுகிறது
        unique: true,   // ஒவ்வொரு ஐடியும் தனித்துவமானது என்பதை உறுதி செய்ய
        sparse: true    // இந்த ஃபீல்ட் இல்லாத டாக்குமெண்ட்களை அனுமதிக்கிறது
    },
    
    
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
        // userType: {
        //     type: String,
        //     enum: ["admin", "user"],
        //     default: "user",
        // },
        // planType: {
        //     type: String,
        //     enum: ["premium", "normal"],
        //     default: "normal",
        // },
        // planDetails: {
        //     expiryDate: { type: Date },
        //     features: [{ type: String }],
        // },

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
            hasLoan: { type: Boolean },
            hasCar: { type: Boolean },
            propertyDetails: { type: String },
            drinkingHabit: { type: String },

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
    // ======================================================
// 🔹 PARTNER PREFERENCES (திருத்தப்பட்ட பிரிவு)
// ======================================================
partnerPreferences: {
    partnerAgeFrom: { type: Number },
    partnerAgeTo: { type: Number },
    partnerMaritalStatus: { type: String},
    partnerHometown: { type: String},
    
    // 👇 இந்த Multi ஃபீல்டுகள் அனைத்தையும் [String] என மாற்றவும்
    partnerJobTown: { type: [String], default: undefined,
    required: false}, 
    
    partnerReligion: { type: String, trim: true },
    partnerSubcaste: { type: String, trim: true },
    partnerEducation: { type: String, trim: true },
    partnerJob: { type: String, trim: true },
    partnerSalary: { type: String, trim: true },
    
    // 👇 இந்த ஃபீல்டையும் [String] என மாற்றவும்
    partnerHometownMulti: { type: [String], default: undefined,
    required: false}, 
    
    partnerChevai: { type: String, trim: true },
    partnerPhysicalChallenge: { type: String, trim: true },
    partnerHouseType: { type: String },
    partnerGold: { type: String, trim: true },
    partnerSkinColor: { type: String},
    
    // 👇 ராசி (Rasi) மற்றும் நட்சத்திரம் (Star) ஆகிய இரண்டையும் [String] என மாற்றவும்
    partnerStarMulti: { type: [String], default: undefined,
    required: false}, 
    partnerRasiMulti: { type: [String], default: undefined,
    required: false}, // 👈 இந்தப் ஃபீல்டுதான் பிழையைத் தந்தது
},


        // ======================================================
        // 🔹 PHOTOS
        // ======================================================
        // This is now correctly referencing the defined schema
   // models/User.js - Main Schema-வில் உள்ள photos பகுதி

photos: {
    type: userPhotosSchema, 
    // 👇 இதுதான் முக்கிய மாற்றம். default: () => ({}) பதிலாக இதை அமைக்கவும்.
    // நீங்கள் photos விவரங்களை வழங்கவில்லை என்றால், Mongoose அதை முழுவதுமாகத் தவிர்த்துவிடும்.
    default: undefined,
    required: false
},
        
        // ======================================================
        // 🔹 STATUS FLAGS
        // ======================================================
        status: {
            isProfileCompleted: { type: Boolean},
            isVerified: { type: Boolean},
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
