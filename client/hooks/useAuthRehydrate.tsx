import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setCredentials } from '../store/authSlice'

export default function useAuthRehydrate() {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const userString = await AsyncStorage.getItem('user')
        const expiryStr = await AsyncStorage.getItem('expiry')
        const expiry = expiryStr ? parseInt(expiryStr) : null

        if (token && userString && expiry) {
          dispatch(
            setCredentials({ token, user: JSON.parse(userString), expiry })
          )
        }
      } catch (error) {
        console.error('Failed to rehydrate user', error)
      }
    }

    loadUser()
  }, [dispatch])
}
