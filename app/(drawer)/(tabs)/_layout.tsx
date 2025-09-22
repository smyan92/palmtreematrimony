import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import CustomHeader from '@/components/customHeader/CustomHeader';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFB634',    // Active icon color (orange)
        tabBarInactiveTintColor: '#9C9C9C',  // Inactive icon color (gray)
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          header: () => <CustomHeader title="Home" showBackButton={false} />,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          header: () => <CustomHeader title="Search" />,
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fav"
        options={{
          title: 'Favorites',
          header: () => <CustomHeader title="Favorites" />,
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-sharp" size={size ?? 24} color={color} />
          ),
        }}
      />
<Tabs.Screen
  name="ProfileDetails"
  options={{
    href: null,         // Hidden from the bottom tab menu
    headerShown: false, // Set to true if you want header
    // tabBarStyle: { display: 'none' }, ❌ remove this
  }}
/>



    </Tabs>
  );
}
