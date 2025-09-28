import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../store/authSlice'

const API_URL = 'http://192.168.43.38:5000'
const { width } = Dimensions.get('window')

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true) // ✅ loading state

  const dispatch = useDispatch()

  // ✅ Check token on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const userString = await AsyncStorage.getItem('user')
        const expiryStr = await AsyncStorage.getItem('expiry')

        if (token && userString && expiryStr) {
          const expiry = parseInt(expiryStr, 10)
          if (Date.now() < expiry) {
            dispatch(
              setCredentials({
                token,
                user: JSON.parse(userString),
                expiry,
              })
            )
            router.replace('/(drawer)/(tabs)')
            return
          } else {
            // Expired → remove
            await AsyncStorage.multiRemove(['token', 'user', 'expiry'])
          }
        }
      } catch (error) {
        console.error('Auto-login check failed', error)
      } finally {
        setLoading(false) // ✅ done checking
      }
    }

    checkToken()
  }, [dispatch])

  if (loading) {
    // ✅ Show spinner while checking token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    )
  }

  const handleAuth = async () => {
    try {
      if (activeTab === 'login') {
        if (!mobileNo || !password) {
          Alert.alert('Error', 'Please enter phone and password')
          return
        }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNo, password }),
        })

        const data = await response.json()
        if (!response.ok || !data?.token || !data?.user) {
          Alert.alert('Error', data?.message || 'Invalid login credentials')
          return
        }

        const expiry = Date.now() + 60 * 60 * 1000
        dispatch(
          setCredentials({
            token: data.token,
            user: { mobileNo: data.user.mobileNo, fullName: data.user.fullName },
            expiry,
          })
        )

        await AsyncStorage.setItem('token', data.token)
        await AsyncStorage.setItem('user', JSON.stringify(data.user))
        await AsyncStorage.setItem('expiry', expiry.toString())

        router.replace('/(drawer)/(tabs)')
      } else {
        if (!fullName || !mobileNo || !password) {
          Alert.alert('Error', 'Please fill all fields')
          return
        }

        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, mobileNo, password }),
        })

        const data = await response.json()
        if (!response.ok) {
          Alert.alert('Error', data?.message || 'Signup failed')
          return
        }

        Alert.alert('Success', 'Signup successful. Please login.')
        setActiveTab('login')
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      Alert.alert('Error', error.message || 'Something went wrong')
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/treebg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.box}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={mobileNo}
          onChangeText={setMobileNo}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {activeTab === 'login' && (
          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => router.push('/(auth)/ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{activeTab === 'login' ? 'Login' : 'Signup'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  box: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  tabs: { flexDirection: 'row', marginBottom: 20, width: '100%' },
  tabButton: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#eee' },
  activeTab: { backgroundColor: '#22c55e' },
  tabText: { fontWeight: '600' },
  activeTabText: { color: '#fff' },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  forgotContainer: { alignSelf: 'flex-end', marginBottom: 12 },
  forgotText: { color: '#2563eb', textDecorationLine: 'underline', fontWeight: '600' },
  button: { padding: 14, backgroundColor: '#f97316', borderRadius: 8, width: '100%' },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
})
