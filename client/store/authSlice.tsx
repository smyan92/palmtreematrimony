import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  fullName: string
  mobileNo: string
  userType: 'admin' | 'normal'   // or string if more types
  planType: 'premium' | 'normal' // or string if more types
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
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User; expiry: number }>
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.expiry = action.payload.expiry
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.expiry = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
