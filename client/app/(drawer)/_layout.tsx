import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#F18221',     // Active text color
        drawerInactiveTintColor: '#7A7A7A',   // Inactive text color
        drawerLabelStyle: {
          fontWeight: '600',
        },
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
