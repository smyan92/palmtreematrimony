import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  fullName: string
  mobileNo: string
}

export interface AuthState {
  token: string | null
  user: User | null
  expiry: number | null   // ✅ Add this
}

const initialState: AuthState = {
  token: null,
  user: null,
  expiry: null,           // ✅ Initialize
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
