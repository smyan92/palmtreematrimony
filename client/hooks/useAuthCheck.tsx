import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { logout } from '../store/authSlice'
import { router } from 'expo-router'

export default function useAuthCheck() {
  const { token, expiry } = useSelector((state: RootState) => state.auth)  // ✅ token & expiry exist now
  const dispatch = useDispatch()

  useEffect(() => {
    if (!token || !expiry) {
      router.replace('/(auth)/login')
      return
    }

    const remaining = expiry - Date.now()

    if (remaining <= 0) {
      dispatch(logout())
      router.replace('/(auth)/login')
      return
    }

    const timer = setTimeout(() => {
      dispatch(logout())
      router.replace('/(auth)/login')
    }, remaining)

    return () => clearTimeout(timer)
  }, [token, expiry])
}
