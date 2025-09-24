import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://192.168.43.38:5000/api';




const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

const handleAuth = async () => {
  try {
    if (activeTab === 'login') {
      if (!phoneNumber || !password) {
        Alert.alert('Error', 'Please enter phone and password');
        return;
      }
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: phoneNumber, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Save token
      await AsyncStorage.setItem('token', data.token);
      Alert.alert('Success', 'Login successful');

      // Navigate to main app screen
      router.replace('/(drawer)/(tabs)');
    } else {
      // Signup
      if (!fullName || !phoneNumber || !password) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: phoneNumber, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      Alert.alert('Success', 'Signup successful. Please login.');
      setActiveTab('login');
    }
  } catch (error: any) {
    Alert.alert('Error', error.message);
  }
};

  const handleSendOtp = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    Alert.alert('OTP Sent', `OTP sent to ${phoneNumber}`);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Enter valid OTP');
      return;
    }
    Alert.alert('OTP Verified', 'Please reset your password');
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', 'Password reset successfully!');
    setShowForgotPassword(false);
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setPassword('');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/treebg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Welcome Text */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTextA}>WELCOME</Text>
        <Text style={styles.welcomeTextB}>NADARS..!</Text>
      </View>

      {/* Circular Box */}
      <View style={styles.box}>
        {!showForgotPassword ? (
          <>
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

            {/* Signup only: Full Name */}
            {activeTab === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            )}

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="Enter your phone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Forgot Password Link */}
            {activeTab === 'login' && (
              <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleAuth}>
              <Text style={styles.buttonText}>{activeTab === 'login' ? 'Login' : 'Signup'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Forgot Password Flow */}
            <Text style={styles.subTitle}>Reset Password</Text>

            {step === 1 && (
              <>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.label}>Enter OTP</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                />
                <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 3 && (
              <>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                  <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => setShowForgotPassword(false)}>
              <Text style={styles.link}>← Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  welcomeContainer: {
    position: 'absolute',
    top: 80,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  welcomeTextA: {
    color: '#fff',
    fontSize: width * 0.12,
    fontWeight: '400',
    letterSpacing: 2,
  },
  welcomeTextB: {
    color: '#fff',
    fontSize: width * 0.12,
    fontWeight: '900',
    letterSpacing: 2,
  },
box: {
  width: '90%',
  aspectRatio: 1,
  backgroundColor: 'white',
  borderRadius: 9999,
  padding: 24,
  marginTop: 250,
  justifyContent: 'center',
  alignItems: 'center',

  // 🛠️ Add this line to fix horizontal alignment
  alignSelf: 'center',

  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 10,
},

  tabs: {
    flexDirection: 'row',
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#22c55e',
  },
  tabText: {
    color: '#000',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#f97316',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    marginTop: 8,
    color: '#22c55e',
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
});
