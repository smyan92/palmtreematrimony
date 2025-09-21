import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;       // Username
  avatarUri?: string;  // Optional avatar URL
}

export default function CustomHeader({ title, avatarUri }: CustomHeaderProps) {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // This value can be passed as a prop to make the bar dynamic
  const profileCompletion = 77; 
  const progressWidth = `${profileCompletion}%`;

  return (
    <View style={styles.header}>
      {/* Left: Avatar + Greeting + Name */}
      <View style={styles.leftContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}

        <View style={styles.greetingContainer}>
          <View style={styles.helloRow}>
            <Text style={styles.helloText}>Hello</Text>
            <FontAwesome5
              name="hand-peace"
              size={18}
              color="#00BF41"
              style={styles.handIcon}
            />
          </View>
          <Text style={styles.title}>{title}</Text>

          {/* Profile completion progress bar and text */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressText}>{profileCompletion}% Profile Completion</Text>
          </View>

        </View>
      </View>

      {/* Right: Drawer toggle */}
      <Pressable onPress={openDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="black" />
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 130,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: 'white',
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: "#66666622",
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  helloRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helloText: {
      color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  handIcon: {
    marginLeft: 6,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  
  // NEW STYLES
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    width: 140, // A fixed width for the entire bar
    height: 8,
    backgroundColor: '#FFD9E8', // Light pink color
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF4189', // Darker pink fill color
    borderRadius: 4,
  },
  progressText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
});