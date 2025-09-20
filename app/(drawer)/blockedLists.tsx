import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BlockedLists() {
  return (
    <View style={styles.container}>
      <Text>Blocked Lists</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
