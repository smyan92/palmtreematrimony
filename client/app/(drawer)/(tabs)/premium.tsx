import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';

export default function Premium() {
 

  return (
    <View style={styles.container}>
      <Text>
Premium
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
