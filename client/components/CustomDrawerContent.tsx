import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as logoutAction } from '../store/authSlice';
import { router } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export default function CustomDrawerContent(props: any) {
  const dispatch = useDispatch();
  const { navigation } = props; // ✅ use props.navigation

  const closeDrawer = () => {
    navigation.closeDrawer(); // ✅ works because it's the drawer navigation
  };

  const logout = async () => {
    try {
      closeDrawer();

      // Clear Redux
      dispatch(logoutAction());

      // Clear AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('expiry');

      Alert.alert('Success', 'You have been logged out.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <Pressable onPress={closeDrawer} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#00BF41" />
        </Pressable>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <Pressable onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 16,
    margin: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F18221',
    backgroundColor: 'transparent',
  },
  logoutText: {
    color: '#F18221',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
