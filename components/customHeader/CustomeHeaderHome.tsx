import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomHeaderProps {
  title: string;
  onMenuPress?: () => void;
  avatarUri?: string;
}

export default function CustomHeader({
  title,
  onMenuPress,
  avatarUri,
}: CustomHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="#fff" />
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#6200ee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  menuButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
