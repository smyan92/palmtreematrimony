import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

export default function Logout(props) {
  const router = useRouter();

  const handleLogout = () => {
    // Add your logout logic here, e.g., clear tokens, reset state
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => {
          // Navigate to login or splash screen after logout
          router.replace('/'); // or your auth screen
        } 
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f44336',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
