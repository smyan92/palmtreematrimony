import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';
import CustomHeader from '@/components/CustomHeader';


export default function Fav() {
 

  return (
    <View style={styles.container}>
      <Text>
fav
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
});
