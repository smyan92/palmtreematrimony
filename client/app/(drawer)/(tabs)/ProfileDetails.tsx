import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomHeader from '@/components/customHeader/CustomHeader';

const ProfileDetails = () => {
  const profile = {
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'G. Srivalli',
    age: 22,
    profession: 'Software Engineer',
    details: {
      Gender: 'Male',
      Married: 'No', // New field
      Age: '30',
      DOB: '7/12/1992',
      'Father\'s Name': 'P. Anjaneyulu', // New field
      'Father\'s Job': 'Retired Engineer', // New field
      'Mother\'s Name': 'S. Vasantha', // New field
      'Mother\'s Job': 'Housewife', // New field
      Brothers: '2', // New field
      'Brothers\' names': 'Raju (Teacher), Srikanth (Doctor)', // New field
      Sisters: '1', // New field
      'Sisters\' names': 'Priya (Nurse)', // New field
      Color: 'Black',
      Religion: 'Hindu',
      Caste: 'Nadar',
      Rasi: 'Mesham',
      Natchatiram: 'Bharani',
      'Dhosam any': 'No',
      'Kula Sami': 'Sakkamal',
      'Home Town': 'Madurai',
      'Job Town': 'Chennai',
      Job: 'Engineer',
      'Monthly Salary': '₹50,000',
      'Monthly Loan': '₹5,000',
      'House Type': 'Owned',
      'Properties list': 'Land, House',
      'Vehicles list': 'Bike, Car',
      'Nagai Yethirparu': '5 Sovereign',
      'Body Type': 'Slim',
      Eating: 'Veg',
      Smoking: 'No',
      Drinks: 'No',
      'Pre Existing Disease': 'None',
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Profile Details" showBackButton />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: profile.image }} style={styles.image} />
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>📞 CALL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>
              {profile.name} ({profile.age})
            </Text>
            <Text style={styles.profession}>{profile.profession}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailsGrid}>
            {Object.entries(profile.details).map(([key, value]) => (
              <View style={styles.detailItem} key={key}>
                <Text style={styles.detailKey}>{key}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.fullCallButton}>
            <Text style={styles.fullCallText}>📞 CALL for More Info</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export const options = {
  headerShown: false,
  tabBarStyle: { display: 'none' },
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  callButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#00b386',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  profession: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  // Updated styles for the details section
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  detailItem: {
    width: '48%', // Sets up a two-column grid
    marginBottom: 16,
  },
  detailKey: {
    fontSize: 16,
    fontWeight: 'bold', // Make the key stand out
    color: '#333',
    marginBottom: 4, // Add spacing between key and value
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
  },
  fullCallButton: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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