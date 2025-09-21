import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;       // This will be the user name shown next to profile pic
  avatarUri?: string;
}

export default function CustomHeader({
  title,
  avatarUri,
}: CustomHeaderProps) {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.header}>
      {/* Left: Avatar + Name */}
      <View style={styles.leftContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right: Hamburger menu icon */}
      <Pressable onPress={openDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingHorizontal: 16,
    backgroundColor: '#01A550',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,  // space between avatar and name
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
  },
});
