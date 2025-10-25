import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  fullName: string
  mobileNo: string
  userType: 'admin' | 'normal'   // user's role
  planType: 'premium' | 'normal' // subscription status
  
  // Single, optional property for the main profile photo URL
  profilePhotoUrl?: string | null 
  
}

export interface AuthState {
  token: string | null
  user: User | null
  expiry: number | null
}

const initialState: AuthState = {
  token: null,
  user: null,
  expiry: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set all authentication details upon successful login
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User; expiry: number }> 
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.expiry = action.payload.expiry
    },
    // Action to clear credentials upon logout
    logout: (state) => {
      state.token = null
      state.user = null
      state.expiry = null
    },
    // Optional: Reducer to update just the profile photo after an upload
    updateProfilePhoto: (
        state,
        action: PayloadAction<string>
    ) => {
        if (state.user) {
            state.user.profilePhotoUrl = action.payload;
        }
    }
  },
})

export const { setCredentials, logout, updateProfilePhoto } = authSlice.actions
export default authSlice.reducer
