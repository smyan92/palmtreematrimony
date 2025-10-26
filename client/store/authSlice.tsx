import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ----------------------------------------------------
// 1. UPDATED INTERFACES
// ----------------------------------------------------

interface User {
    id: string;
    fullName: string;
    mobileNo: string;
    userType: 'admin' | 'normal';   // user's role
    planType: 'premium' | 'normal'; // subscription status
    profilePhotoUrl?: string | null;
    allPhotosUrls?: string[];
}

// Type for the versatile user profile update
interface UserUpdatePayload {
    fullName?: string;
    mobileNo?: string;
    userType?: 'admin' | 'normal';
    planType?: 'premium' | 'normal';
    // Add other updateable fields here as needed
}

export interface AuthState {
    token: string | null;
    user: User | null;
    expiry: number | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    expiry: null,
};

// ----------------------------------------------------
// 2. AUTH SLICE WITH NEW REDUCERS
// ----------------------------------------------------

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; user: User; expiry: number }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.expiry = action.payload.expiry;
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            state.expiry = null;
        },

        // --- Photo Management Reducers ---

        updateProfilePhoto: (
            state,
            action: PayloadAction<string>
        ) => {
            if (state.user) {
                state.user.profilePhotoUrl = action.payload;
            }
        },

        updateGalleryPhotos: (
            state,
            action: PayloadAction<string[]>
        ) => {
            if (state.user) {
                state.user.allPhotosUrls = action.payload;
            }
        },
        
        /** * 🟢 NEW 1: Adds a new photo URL to the beginning of the gallery array.
         * This is useful right after a successful upload.
         */
        addGalleryPhoto: (
            state,
            action: PayloadAction<string> // Expects a single new photo URL
        ) => {
            if (state.user) {
                // Initialize the array if it doesn't exist, then prepend the new photo
                const urls = state.user.allPhotosUrls || [];
                state.user.allPhotosUrls = [action.payload, ...urls];
            }
        },

        /** * 🟢 NEW 2: Removes a photo URL from the gallery array.
         * Assumes the payload is the exact URL to be removed.
         */
        removeGalleryPhoto: (
            state,
            action: PayloadAction<string> // Expects the URL of the photo to remove
        ) => {
            if (state.user && state.user.allPhotosUrls) {
                state.user.allPhotosUrls = state.user.allPhotosUrls.filter(
                    url => url !== action.payload
                );
            }
        },

        // --- Generic Profile Update Reducer ---

        /** * 🟢 NEW 3: Updates multiple non-photo profile fields at once.
         * This avoids creating separate reducers for every single field.
         */
        updateUserProfile: (
            state,
            action: PayloadAction<UserUpdatePayload>
        ) => {
            if (state.user) {
                // Merges the payload into the existing user object
                state.user = { 
                    ...state.user, 
                    ...action.payload 
                };
            }
        }
    },
});

// ----------------------------------------------------
// 3. EXPORT ACTIONS AND REDUCER
// ----------------------------------------------------

export const { 
    setCredentials, 
    logout, 
    updateProfilePhoto, 
    updateGalleryPhotos,
    // Export the new actions
    addGalleryPhoto,       
    removeGalleryPhoto,    
    updateUserProfile      
} = authSlice.actions;

export default authSlice.reducer;