// components/CustomHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CustomHeader({ title, showBackButton = true }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBackButton && navigation.canGoBack() && (
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#01A550',
    justifyContent: "center",   // center children vertically
    alignItems: "center",       // center horizontally
  },
  backButton: {
    position: "absolute",
    right: 160,   
    paddingTop: 20,
    fontSize: 24,
    color: "#fff",
  },
  title: {
    fontSize: 22,
    paddingTop: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
