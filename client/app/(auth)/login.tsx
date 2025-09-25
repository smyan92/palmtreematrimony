import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../store/authSlice'

const API_URL = 'http://192.168.43.38:5000' // your backend

const { width } = Dimensions.get('window')

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleAuth = async () => {
    try {
      if (activeTab === 'login') {
        if (!phoneNumber || !password) {
          Alert.alert('Error', 'Please enter phone and password')
          return
        }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: phoneNumber, password }),
        })

        const data = await response.json()
        console.log('Login response:', data)

        if (!data.token || !data.fullName) {
          Alert.alert('Error', 'Invalid login credentials')
          return
        }

        const expiry = Date.now() + 60 * 60 * 1000 // 1 hour

        // Save to Redux
        dispatch(
          setCredentials({
            token: data.token,
            user: { username: data.username, fullName: data.fullName },
            expiry,
          })
        )

        // Save to AsyncStorage
        await AsyncStorage.setItem('token', data.token)
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({ username: data.username, fullName: data.fullName })
        )
        await AsyncStorage.setItem('expiry', expiry.toString())


const checkStorage = async () => {
  const token = await AsyncStorage.getItem('token')
  const user = await AsyncStorage.getItem('user')
  console.log('AsyncStorage token:', token)
  console.log('AsyncStorage user:', user)
}

checkStorage()  // Call after login or logout


        Alert.alert('Success', 'Login successful')
        router.replace('/(drawer)/(tabs)')
      } else {
        // Signup
        if (!fullName || !phoneNumber || !password) {
          Alert.alert('Error', 'Please fill all fields')
          return
        }

        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, username: phoneNumber, password }),
        })

        const data = await response.json()
        console.log('Signup response:', data)

        if (!response.ok) throw new Error(data.message || 'Signup failed')

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

        {/* Signup Full Name */}
        {activeTab === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        )}

        {/* Phone */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Button */}
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
  tabs: { flexDirection: 'row', marginBottom: 20 },
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
  },
  button: { padding: 14, backgroundColor: '#f97316', borderRadius: 8, width: '100%' },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
})
