// components/PartnerProfileCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Assuming Expo vector icons

// Interface for a single profile item
export interface PartnerProfile {
  id: string;
  name: string;
  age: number;
  profession: string;
  avatarUri: string;
  location: string;
  mesam: string; // Additional detail
}

interface PartnerProfileCardProps {
  profile: PartnerProfile;
  onReject?: (profileId: string) => void;
  onLike?: (profileId: string) => void;
  onPress?: (profile: PartnerProfile) => void; // Optional for full card press
}

const PartnerProfileCard: React.FC<PartnerProfileCardProps> = ({
  profile,
  onReject,
  onLike,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress && onPress(profile)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />

      {/* Action Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.rejectButton} onPress={() => onReject && onReject(profile.id)}>
          <Ionicons name="close" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={() => onLike && onLike(profile.id)}>
          <MaterialCommunityIcons name="heart-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Ionicons name="location-sharp" size={12} color="white" style={styles.tagIcon} />
          <Text style={styles.tagText}>{profile.location}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{profile.mesam}</Text>
        </View>
      </View>

      {/* Text Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{profile.name} ({profile.age})</Text>
        <Text style={styles.profession}>{profile.profession}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 200, // Fixed width for each card as per image
    height: 250, // Adjust height as needed
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginHorizontal: 10,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: '100%',
    height: '70%', // Image takes up more space
    resizeMode: 'cover',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1, // Ensure icons are above the image
  },
  rejectButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc', // Light border
  },
  likeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc', // Light border
  },
  tagsContainer: {
    position: 'absolute',
    bottom: '35%', // Position above the text details
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    transform: [{ translateY: 15 }], // Overlap slightly with the image
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6F00', // Orange color for tags
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1, // Take remaining vertical space
    paddingHorizontal: 10,
    paddingVertical: 15, // Adjusted padding for text details
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profession: {
    fontSize: 14,
    color: '#666',
  },
});

export default PartnerProfileCard;