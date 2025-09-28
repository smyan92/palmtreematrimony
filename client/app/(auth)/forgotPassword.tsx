import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'; // adjust path



const API_URL = 'http://192.168.43.38:5000'; // your backend IP

export default function ForgotPassword() {
const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Request OTP
  // -----------------------------
  const handleRequestOTP = async () => {
    if (mobileNo.length !== 10) {
      Alert.alert('Warning', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNo }),
      });

      // Safe JSON parsing
      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        console.error('Response not JSON:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) throw new Error(data.message || 'Failed to request OTP.');

      Alert.alert('Success', data.message || 'OTP sent successfully!');
      setStep(2);
    } catch (error: any) {
      console.error('OTP request error:', error);
      Alert.alert('Error', error.message || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Reset Password
  // -----------------------------
const handleResetPassword = async () => {
  if (!otp || newPassword.length < 6 || newPassword !== confirmPassword) {
    Alert.alert(
      'Warning',
      'Please ensure you enter the OTP and both passwords match (min 6 chars).'
    );
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNo, otp, newPassword }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      console.error('Response not JSON:', text);
      throw new Error('Invalid server response');
    }

    if (!response.ok) throw new Error(data.message || 'Password reset failed.');

    // ✅ Clear AsyncStorage
    await AsyncStorage.multiRemove(['token', 'user', 'expiry']);

    // ✅ Dispatch logout in Redux
    dispatch(logout());

    Alert.alert('Success', data.message || 'Password reset successful!');
    router.replace('/(auth)/login'); // go back to login
  } catch (error: any) {
    console.error('Reset error:', error);
    Alert.alert('Error', error.message || 'Failed to reset password.');
  } finally {
    setLoading(false);
  }
};


  // -----------------------------
  // Step Components
  // -----------------------------
  const renderStepOne = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your registered mobile number to receive a verification code.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="10-digit Mobile Number"
        value={mobileNo}
        onChangeText={setMobileNo}
        keyboardType="phone-pad"
        maxLength={10}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, mobileNo.length !== 10 && styles.buttonDisabled]}
        onPress={handleRequestOTP}
        disabled={mobileNo.length !== 10 || loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Request OTP</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/')}>
        <Text style={styles.linkText}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStepTwo = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to **{mobileNo}** and set a new password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP (6 digits)"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password (min 6 chars)"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[
          styles.button,
          (newPassword !== confirmPassword || newPassword.length < 6 || !otp) && styles.buttonDisabled,
        ]}
        onPress={handleResetPassword}
        disabled={newPassword !== confirmPassword || newPassword.length < 6 || !otp || loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => setStep(1)}>
        <Text style={styles.linkText}>← Change Mobile Number</Text>
      </TouchableOpacity>
    </View>
  );

  return <View style={styles.container}>{step === 1 ? renderStepOne() : renderStepTwo()}</View>;
}

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 20 },
  contentContainer: { width: '100%', maxWidth: 400, backgroundColor: '#fff', padding: 25, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fff', fontSize: 16 },
  button: { padding: 14, backgroundColor: '#f97316', borderRadius: 8, width: '100%', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#ffb27d' },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkButton: { marginTop: 15, padding: 8 },
  linkText: { textAlign: 'center', color: '#22c55e', fontWeight: '600', fontSize: 14 },
});
