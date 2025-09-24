import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

// Get screen width for responsive sizing
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.3; // Roughly 40% of screen width for each item

// Interface for a single profile item
interface Profile {
  id: string;
  name: string;
  age: number;
  mesam: string; // Assuming 'mesam' is a specific detail like a sub-title
  avatarUri: string;
}

// Props for the NewProfiles component
interface NewProfilesProps {
  profiles: Profile[];
  onProfilePress?: (profile: Profile) => void; // Optional handler for when a profile is pressed
}

// Individual Profile Card component
const ProfileCard: React.FC<{ profile: Profile; onPress?: (profile: Profile) => void }> = ({ profile, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(profile);
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{profile.name} ({profile.age})</Text>
        <Text style={styles.mesam}>{profile.mesam}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Main NewProfiles component
const NewProfiles: React.FC<NewProfilesProps> = ({ profiles, onProfilePress }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>New Profiles</Text>
      <FlatList
        data={profiles}
        renderItem={({ item }) => <ProfileCard profile={item} onPress={onProfilePress} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 20,
    paddingLeft: 16, // Padding for the title and the start of the list
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000000ff', // Blue for the title as in the image
  },
  flatListContent: {
    paddingRight: 16, // Ensures the last item isn't cut off and has padding
  },
  cardContainer: {
    width: ITEM_WIDTH,
    borderRadius: 10,
    overflow: 'hidden', // Ensures image and details respect border radius
    marginRight: 15, // Space between cards
    backgroundColor: 'white', // Background for the entire card if needed
 
  },
  avatar: {
    width: '100%',
    height: ITEM_WIDTH, // Make image square based on item width
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: '#047128a8', // Green background for text as in the image
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomLeftRadius: 10, // Match card radius
    borderBottomRightRadius: 10, // Match card radius
  },
  name: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mesam: {
    color: 'white',
    fontSize: 10,
  },
});

export default NewProfiles;