import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../components/customHeader/CustomeHeaderHome'; // adjust path as needed

export default function HomeScreen() {
  const userPhotoUri = 'https://randomuser.me/api/portraits/men/75.jpg';

  const openMenu = () => {
    console.log('Menu pressed');
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Home" onMenuPress={openMenu} avatarUri={userPhotoUri} />

      <View style={styles.content}>
        <Text style={{ fontSize: 22, color: '#fff' }}>Homescreen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
