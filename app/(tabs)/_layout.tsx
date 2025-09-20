import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
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
    // Don't hide headers globally
  }}>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
       header: () => <CustomHeader title="Home" showBackButton={false}  />,
      headerShown: true,
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
      title: 'fav',
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
      title: 'profile',
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
