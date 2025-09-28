import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setCredentials, logout } from '../store/authSlice'

export default function useAuthRehydrate() {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const userString = await AsyncStorage.getItem('user')
        const expiryStr = await AsyncStorage.getItem('expiry')

        if (!token || !userString || !expiryStr) return

        const expiry = parseInt(expiryStr, 10)
        const now = Date.now()

        if (now < expiry) {
          // ✅ Token still valid
          dispatch(
            setCredentials({
              token,
              user: JSON.parse(userString),
              expiry,
            })
          )
        } else {
          // ❌ Expired → clear storage & logout
          await AsyncStorage.multiRemove(['token', 'user', 'expiry'])
          dispatch(logout()) // ✅ use logout
        }
      } catch (error) {
        console.error('Failed to rehydrate user', error)
      }
    }

    loadUser()
  }, [dispatch])
}
