// components/PartnershipPreferencesTabs.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import PartnerProfileCard, { PartnerProfile } from './ProfileCards'; // Import the card and its interface

interface PartnershipPreferencesTabsProps {
  allProfiles: PartnerProfile[];
  partnerPreferenceProfiles: PartnerProfile[];
}

const PartnershipPreferencesTabs: React.FC<PartnershipPreferencesTabsProps> = ({
  allProfiles,
  partnerPreferenceProfiles,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'preferences'>('all');

  const handleReject = (id: string) => {
    Alert.alert("Reject", `Profile ${id} rejected!`);
    // Implement actual rejection logic here (e.g., update state, call API)
  };

  const handleLike = (id: string) => {
    Alert.alert("Like", `Profile ${id} liked!`);
    // Implement actual like logic here (e.g., update state, call API)
  };

  const handleProfilePress = (profile: PartnerProfile) => {
    Alert.alert("Profile Clicked", `You clicked on ${profile.name}, a ${profile.profession}`);
    // Navigate to profile details screen
  };

  const displayProfiles = activeTab === 'all' ? allProfiles : partnerPreferenceProfiles;

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'preferences' && styles.activeTabButton]}
          onPress={() => setActiveTab('preferences')}
        >
          <Text style={[styles.tabText, activeTab === 'preferences' && styles.activeTabText]}>
            Partner Preferences
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile List */}
      <FlatList
        data={displayProfiles}
        renderItem={({ item }) => (
          <PartnerProfileCard
            profile={item}
            onReject={handleReject}
            onLike={handleLike}
            onPress={handleProfilePress}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.profileListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light grey background
    paddingTop: 10, // Adjust based on your screen layout
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align tabs to the left
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginRight: 10, // Space between tabs
    borderBottomWidth: 2,
    borderBottomColor: 'transparent', // Default transparent border
  },
  activeTabButton: {
    borderBottomColor: '#dc3545', // Red underline for active tab
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal',
  },
  activeTabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  profileListContent: {
    paddingHorizontal: 5, // Padding around the horizontal list
    paddingBottom: 20, // Space below the list
  },
});

export default PartnershipPreferencesTabs;