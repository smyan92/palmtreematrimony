// app/(drawer)/(tabs)/home.js
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../../components/customHeader/CustomeHeaderHome';

export default function HomeScreen() {
  const avatarUri = 'https://randomuser.me/api/portraits/men/75.jpg';

  return (
    <View style={styles.container}>
      <CustomHeader title="Home" avatarUri={avatarUri} />
      <View style={styles.content}>
        <Text style={{ fontSize: 22, color: '#fff' }}>Home Tab</Text>
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
