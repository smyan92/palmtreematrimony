import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; // Import Ionicons

// Dummy data for the cards
const dummyData = [
  { id: '1', name: 'G. Srivalli (22)', job: 'Software engineer', city: 'Hyderabad', tag: 'mesam (bharani)', imageUrl: 'https://images.unsplash.com/photo-1520698188200-c9a76d8b0222?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '2', name: 'P. Anjali (24)', job: 'Data scientist', city: 'Bangalore', tag: 'kumbha (sravana)', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '3', name: 'S. Divya (25)', job: 'Product manager', city: 'Hyderabad', tag: 'simha (uttara)', imageUrl: 'https://images.unsplash.com/photo-1544256718-3294821a8128?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '4', name: 'V. Lakshmi (23)', job: 'UX designer', city: 'Chennai', tag: 'tula (chitra)', imageUrl: 'https://images.unsplash.com/photo-1563234857-4183a31d93b1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '5', name: 'A. Priya (21)', job: 'Graphic designer', city: 'Pune', tag: 'meena (revathi)', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '6', name: 'N. Riya (26)', job: 'Full-stack developer', city: 'Delhi', tag: 'vrishchik (anuradha)', imageUrl: 'https://images.unsplash.com/photo-1517551468202-b25b6a7153a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const FavouriteCard = ({ data }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: data.imageUrl }} style={styles.cardImage} />

      {/* Action Icons based on your provided PartnerProfileCard.tsx */}
      <View style={styles.iconContainer}>
        {/* Unfavorite button (similar to reject) */}
        <TouchableOpacity style={styles.rejectButton}>
          <Ionicons name="close" size={20} color="black" />
        </TouchableOpacity>
        {/* A simple heart icon to show it's a favorite */}
        <TouchableOpacity style={styles.likeButton}>
          <MaterialCommunityIcons name="heart" size={20} color="red" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardOverlay}>
        <View style={styles.locationTag}>
          <MaterialCommunityIcons name="map-marker" size={12} color="#fff" />
          <Text style={styles.locationText}>{data.city}</Text>
        </View>
        <View style={styles.mesamTag}>
          <Text style={styles.mesamText}>{data.tag}</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.job}>{data.job}</Text>
      </View>
    </View>
  );
};

export default function FavouritesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Fav' }} />
      <FlatList
        data={dummyData}
        renderItem={({ item }) => <FavouriteCard data={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: "25%",
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // New styles from your PartnerProfileCard for icons
  iconContainer: {
    position: 'absolute',
    top: "5%",
    flexDirection: 'row',
    justifyContent: 'space-between', // Align to the right side
    zIndex: 1, // Ensure icons are above the image
    width: '100%',
    paddingHorizontal: 20,
  },
  rejectButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc', // Light border
    marginRight: 5,
  },
  likeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc', // Light border
  },
  // Your original tag styles, but with position change
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  mesamTag: {
    backgroundColor: '#ff9800',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  mesamText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardInfo: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  job: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});