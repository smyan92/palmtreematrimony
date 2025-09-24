import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props: any) {
  const { navigation } = props;

  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  const logout = () => {
    console.log('Logging out...');
    navigation.closeDrawer();
    // Add real logout logic if needed
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top bar with Close button */}
      <View style={styles.topBar}>
        <Pressable onPress={closeDrawer} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#00BF41" />
        </Pressable>
      </View>

      {/* Drawer scroll content */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Logout button fixed at bottom */}
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
    margin: 70,
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
