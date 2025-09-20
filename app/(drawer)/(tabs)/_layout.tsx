// app/(drawer)/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import CustomHeader from '@/components/customHeader/CustomHeader';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
        name="profile"
        options={{
          title: 'Profile',
          header: () => <CustomHeader title="Profile" />,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
