// app/(drawer)/_layout.tsx or _layout.js
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../components/CustomDrawerContent';  // adjust path

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: 'tomato',
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />
      <Drawer.Screen name="editProfile" options={{ title: 'Edit Profile' }} />
      <Drawer.Screen name="blockedLists" options={{ title: 'Blocked Lists' }} />
      <Drawer.Screen name="accountSettings" options={{ title: 'Account Settings' }} />
      <Drawer.Screen name="partnerPreferences" options={{ title: 'Partner Preferences' }} />
      <Drawer.Screen name="logout" options={{ title: 'Logout' }} />
    </Drawer>
  );
}
