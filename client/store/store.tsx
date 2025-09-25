import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: { auth: authReducer },
})

// ✅ Log every state change
store.subscribe(() => {
  console.log('Redux Store updated:', store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
