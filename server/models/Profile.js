const mongoose = require('mongoose');

// Profile Schema - Includes all data necessary for matching and filtering
const ProfileSchema = new mongoose.Schema({
    // 1. User Model இணைப்பு (Linkage to Auth)
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    
    // 2. அடிப்படை விவரங்கள்
    fullName: { type: String, required: true },
    dob: { type: Date, required: true }, // Age calculation/filtering
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    location: { type: String },
    
    // 3. Core Matching & Filtering Fields
    religion: { type: String, required: true },
    community: { type: String }, // Caste/Community filter
    rasi: { type: String }, // Rasi filter
    
    // 4. தொழில் & வருமானம்
    occupation: { type: String },
    education: { type: String },
    annualSalary: { type: Number }, // Salary filter (stored in Rupees)
    
    // 5. மீடியா
    photoUrls: [{ type: String }],
    
    // 6. துணையின் விருப்பத்தேர்வுகள் (Partner Preference Filters)
    // Match Controller இந்த ஃபீல்டைப் பயன்படுத்தி "My Preferences" தேடலைச் செய்யும்.
    partnerPreferences: {
        ageRange: { min: Number, max: Number },
        religion: [{ type: String }],
        community: [{ type: String }],
        rasi: [{ type: String }],
        annualSalaryMin: { type: Number }, // Minimum expected salary
        location: [{ type: String }],
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Profile', ProfileSchema);
