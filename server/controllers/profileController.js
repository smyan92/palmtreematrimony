const Profile = require('../models/Profile');

// வயது ஃபில்டருக்கு தேவையான DOB-ஐ கணக்கிட இந்த ஃபங்ஷனை மீண்டும் பயன்படுத்துகிறோம்
const calculateDOBForAge = (age) => {
    const today = new Date();
    return new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
};

// சுயவிவரத்தை உருவாக்கவும் அல்லது புதுப்பிக்கவும் கையாளுகிறது
exports.createOrUpdateProfile = async (req, res) => {
    try {
        // userId என்பது authMiddleware மூலம் உறுதிசெய்யப்பட்டு req.user-ல் இணைக்கப்படுகிறது.
        const userId = req.user.id; 
        const profileData = req.body;

        // partnerPreferences ஒரு சரியான ஆப்ஜெக்ட்டாக இருப்பதை உறுதி செய்க
        if (profileData.partnerPreferences && typeof profileData.partnerPreferences !== 'object') {
            return res.status(400).json({ msg: 'Partner preferences must be provided as a structured object.' });
        }

        // தற்போதைய பயனருக்கு சுயவிவரம் உள்ளதா எனப் பார்க்கவும்
        let profile = await Profile.findOne({ userId });

        if (profile) {
            // சுயவிவரம் இருந்தால், அதை புதுப்பிக்கவும் (Update)
            profile = await Profile.findOneAndUpdate(
                { userId }, 
                { $set: profileData }, // வழங்கப்பட்ட புலங்களை மட்டும் புதுப்பிக்கிறது
                { new: true, runValidators: true, omitUndefined: true }
            ).select('-partnerPreferences'); // பாதுகாப்புக்காக partnerPreferences-ஐ திரும்ப அனுப்ப வேண்டாம்

            return res.status(200).json({ 
                msg: 'Profile updated successfully', 
                profile 
            });
        } else {
            // சுயவிவரம் இல்லையென்றால், புதிய சுயவிவரத்தை உருவாக்கவும் (Create)
            const newProfile = new Profile({ 
                ...profileData, 
                userId 
            });
            
            profile = await newProfile.save();
            
            return res.status(201).json({ 
                msg: 'Profile created successfully. Start your match search!', 
                profile: profile.toObject({ virtuals: true, versionKey: false }) 
            });
        }
    } catch (err) {
        console.error('Profile CUD Error:', err.message);
        // Validation Error-களைக் கையாளுகிறது (எ.கா: கட்டாயப் புலம் இல்லை)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: `Validation Failed: ${err.message}` });
        }
        res.status(500).send('Server Error during profile creation/update');
    }
};

// உள்நுழைந்த பயனரின் சொந்த சுயவிவரத்தைப் பெறுகிறது
exports.getOwnProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // சுயவிவரத்தைப் பெறவும், User model-லிருந்து email-ஐ இணைக்கவும் (populate)
        const profile = await Profile.findOne({ userId })
            .select('-__v') 
            .populate('userId', 'email'); 

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found. Please create one before viewing.' });
        }
        res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching own profile:', err.message);
        res.status(500).send('Server Error');
    }
};


// சுயவிவரப் பதிவேற்றத்தைக் கையாளுகிறது (புகைப்படங்களை ஒரு Cloud Service-ல் சேமிக்க வேண்டும்)
exports.uploadProfilePhoto = async (req, res) => {
    // குறிப்பு: இந்த லாஜிக் ஒரு ஃபைல் அப்லோட் Middleware (Multer) மற்றும் 
    // AWS S3 அல்லது Google Cloud Storage போன்ற Cloud சேவையைப் பயன்படுத்த வேண்டும்.
    
    // இங்கே, `photoUrl` என்பது Cloud Storage-ல் இருந்து பெறப்பட்ட URL-ஐக் குறிக்கிறது
    const photoUrl = 'https://your-cloud-storage.com/uploaded/photo-url.jpg'; 
    const userId = req.user.id;

    try {
        const profile = await Profile.findOneAndUpdate(
            { userId },
            { $push: { photoUrls: photoUrl } }, // photoUrls Array-ல் புதிய URL-ஐ சேர்க்கிறது
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found. Cannot upload photo.' });
        }

        res.status(200).json({ 
            msg: 'Photo uploaded successfully', 
            photoUrl,
            allPhotos: profile.photoUrls
        });
    } catch (err) {
        console.error('Photo Upload Error:', err.message);
        res.status(500).send('Server Error during photo upload');
    }
};
