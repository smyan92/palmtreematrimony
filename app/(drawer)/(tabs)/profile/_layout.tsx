import { Stack } from 'expo-router';
import CustomHeader from '@/components/customHeader/CustomHeader';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ route }) => <CustomHeader title={route.name} />,
        // or if you want static titles per screen, define per <Stack.Screen>
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
          header: () => <CustomHeader title="Profile" />,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          header: () => <CustomHeader title="Edit Profile" />,
        }}
      />
      <Stack.Screen
        name="setting"
        options={{
          title: 'Settings',
          header: () => <CustomHeader title="Settings" />,
        }}
      />
    </Stack>
  );
}
