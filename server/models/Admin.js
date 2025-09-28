const mongoose = require('mongoose');

// Admin Schema - Stores credentials for administrative access
const AdminSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    // Admin-இன் அனுமதியின் நிலை (e.g., Super Admin, Moderator)
    level: { 
        type: String, 
        enum: ['SuperAdmin', 'Moderator', 'Reviewer'], 
        default: 'Moderator' 
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Admin', AdminSchema);