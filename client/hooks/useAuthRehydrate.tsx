import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials, logout } from '../store/authSlice';

export default function useAuthRehydrate() {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // ✅ avoid state update after unmount

    const loadUser = async () => {
      try {
        const [token, userString, expiryStr] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('expiry'),
        ]);

        if (!token || !userString || !expiryStr) return;

        const expiry = Number(expiryStr);
        if (isNaN(expiry)) return; // ✅ safety check

        const now = Date.now();

        if (now < expiry) {
          // ✅ Token still valid
          const user = JSON.parse(userString);
          if (isMounted) {
            dispatch(setCredentials({ token, user, expiry }));
          }
        } else {
          // ❌ Expired → clear storage & logout
          await AsyncStorage.multiRemove(['token', 'user', 'expiry']);
          if (isMounted) dispatch(logout());
        }
      } catch (error) {
        console.error('Failed to rehydrate user', error);
      }
    };

    loadUser();

    return () => {
      isMounted = false; // ✅ cleanup for safety
    };
  }, [dispatch]);
}
