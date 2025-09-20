import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props: any) {
  const { navigation } = props;

  const closeDrawer = () => {
    navigation.closeDrawer();
  };

  const logout = () => {
    // Replace with your logout logic
    console.log('Logging out...');
    navigation.closeDrawer();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top bar with Close button */}
      <View style={styles.topBar}>
        <Pressable onPress={closeDrawer} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#6200ee" />
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
    backgroundColor: '#d32f2f',
    margin: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
