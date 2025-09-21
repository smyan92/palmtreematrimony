import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 This hides the header for all auth screens
      }}
    />
  );
}
