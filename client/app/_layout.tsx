import React from 'react'
import { Provider } from 'react-redux'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import 'react-native-reanimated'
import { store } from '../store/store'
import { useColorScheme } from '@/hooks/use-color-scheme'
import useAuthRehydrate from '@/hooks/useAuthRehydrate'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StackScreenWrapper />
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  )
}

function StackScreenWrapper() {
  useAuthRehydrate() // ✅ inside Provider

  return (
    <Stack initialRouteName="splash">
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="ProfileDetails" options={{ headerShown: false }} />
    </Stack>
  )
}
