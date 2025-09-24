import FavProfiles from '../../../components/FavProfiles'; 
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';

export default function Fav() {
 

  return (
    <View style={styles.container}>
    <FavProfiles/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
      backgroundColor: 'white',
  },
});
