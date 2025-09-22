import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Entypo } from '@expo/vector-icons';

const ProfileDetails = () => {
  const router = useRouter();

  const profile = {
    image: 'https://example.com/photo.jpg', // Replace with actual URL or local asset
    name: 'G. Srivalli',
    age: 22,
    profession: 'Software engineer',
    details: {
      Gender: 'Male',
      Age: '30',
      DOB: '7/12/1992',
      Color: 'black',
      Religion: 'Hindhu',
      Caste: 'Nadar',
      Rasi: 'mesham',
      Natchatiram: 'Bharani',
      'Dhosam any': 'no',
      'kula sami': 'sakkamal',
      'Home Town': 'Madurai',
      'Job Town': 'Chennai',
      Job: '30',
      'Monthly Salary': '30',
      'Monthly Loan': '30',
      'House Type': '30',
      'Properties list': '30',
      'Vechiles list': '30',
      'nagai yethirparu': '30',
      'Body Type': '30',
      Eating: '30',
      Smoking: '30',
      Drinks: '30',
      'Pre Exesting Disease': '30',
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: profile.image }} style={styles.image} />
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callButtonText}>📞 CALL</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{profile.name} ({profile.age})</Text>
        <Text style={styles.profession}>{profile.profession}</Text>

        <View style={styles.separator} />

        {Object.entries(profile.details).map(([key, value]) => (
          <View style={styles.detailRow} key={key}>
            <Text style={styles.detailKey}>{key}</Text>
            <Text style={styles.detailValue}>: {value}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.fullCallButton}>
          <Text style={styles.fullCallText}>📞 CALL for More Info</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
  callButton: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#00b386',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  callButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  profession: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailKey: {
    fontWeight: '500',
    color: '#444',
    flex: 1,
  },
  detailValue: {
    flex: 1,
    color: '#000',
    textAlign: 'right',
  },
  fullCallButton: {
    marginTop: 16,
    backgroundColor: '#00b386',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fullCallText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
