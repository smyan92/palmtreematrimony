// app/(drawer)/(tabs)/home.tsx (Updated)
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native'; // Import ScrollView
import CustomHeader from '../../../components/customHeader/CustomeHeaderHome';
import FindProfile from '../../../components/FindProfile';
import NewProfiles from '@/components/NewProfiles';
import PartnershipPreferencesTabs, { PartnerProfile } from '../../../components/PreferenceTab'; 

// Dummy data for NewProfiles (already existing)
const DUMMY_PROFILES = [
  { id: '1', name: 'Srivalli G', age: 26, mesam: 'mesam (Bharani)', avatarUri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '2', name: 'Srivalli G', age: 26, mesam: 'mesam (Bharani)', avatarUri: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '3', name: 'Srivalli G', age: 26, mesam: 'mesam (Bharani)', avatarUri: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: '4', name: 'Another Name', age: 24, mesam: 'mesam (Nakshatra)', avatarUri: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

// Dummy data for the new PartnershipPreferencesTabs component
const DUMMY_PARTNER_PROFILES: PartnerProfile[] = [
  { id: 'p1', name: 'G. Srivalli', age: 22, profession: 'Software engineer', avatarUri: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', location: 'Hyderabad', mesam: 'mesam (bharani)' },
  { id: 'p2', name: 'G. Srivalli', age: 22, profession: 'Software engineer', avatarUri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', location: 'Hyderabad', mesam: 'mesam (bharani)' },
  { id: 'p3', name: 'Priya Sharma', age: 24, profession: 'Doctor', avatarUri: 'https://images.pexels.com/photos/3771806/pexels-photo-3771806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', location: 'Bangalore', mesam: 'mesam (rohini)' },
  { id: 'p4', name: 'Anjali Singh', age: 25, profession: 'Designer', avatarUri: 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', location: 'Chennai', mesam: 'mesam (punarvasu)' },
];

export default function HomeScreen() {
  const avatarUri = 'https://randomuser.me/api/portraits/men/75.jpg';

  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.findProfileContainer}>
          <FindProfile />
        </View>
        <View style={styles.newProfilesContainer}>
          <NewProfiles profiles={DUMMY_PROFILES} />
        </View>

        {/* New Partner Preferences Tabs and Profiles */}
        <View style={styles.partnerPreferencesSection}>
          <PartnershipPreferencesTabs
            allProfiles={DUMMY_PARTNER_PROFILES} // Pass data for "All" tab
            partnerPreferenceProfiles={DUMMY_PARTNER_PROFILES.slice(0, 2)} // Example: filtered data for "Preferences" tab
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flex: 1,
  },
  findProfileContainer: {
    marginBottom: 10,
  },
  newProfilesContainer: {
    paddingVertical: 10,
  },
  partnerPreferencesSection: {
    flex: 1,
    marginTop: 20,
  },
});