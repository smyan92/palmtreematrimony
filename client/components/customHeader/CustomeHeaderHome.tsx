import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  ViewStyle // 👈 Important: Import ViewStyle for the fix
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'; // ✅ adjust the path to your store.ts

// --- Interface for Modal Step Data ---

interface ProfileStep {
  id: number;
  label: string;
  isCompleted: boolean;
  onPress: () => void;
}

interface ProfileCompletionModalProps {
  isVisible: boolean;
  onClose: () => void;
  steps: ProfileStep[];
  completionPercentage: number;
}

// --- Profile Completion Modal Component ---

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isVisible, onClose, steps, completionPercentage }) => {
  const progressWidth = `${completionPercentage}%`;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Pressable to close modal when clicking outside */}
      <Pressable style={modalStyles.centeredView} onPress={onClose}>
        {/* Inner Pressable to prevent modal close when clicking inside */}
        <Pressable style={modalStyles.modalView} onPress={(e) => e.stopPropagation()}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Complete your profile</Text>
            <Text style={modalStyles.subtitle}>
              By completing all the details you have a higher chance of being seen by recruiters.
            </Text>

            <View style={modalStyles.progressBarContainer}>
              <Text style={modalStyles.percentageText}>{completionPercentage}%</Text>
              <View style={modalStyles.progressBar}>
                {/* 🎯 FIX APPLIED HERE: Casting to ViewStyle */}
                <View style={[modalStyles.progressBarFill, { width: progressWidth } as ViewStyle]} />
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={modalStyles.stepsContainer}>
            {steps.map((step) => (
              <TouchableOpacity key={step.id} style={modalStyles.stepItem} onPress={step.onPress}>
                <View style={modalStyles.stepIconContainer}>
                  {step.isCompleted ? (
                    <Ionicons name="checkmark-circle" size={24} color="#00BF41" />
                  ) : (
                    <MaterialCommunityIcons name="circle-outline" size={24} color="#666666" />
                  )}
                </View>
                <Text style={modalStyles.stepText}>{step.label}</Text>
                <Ionicons name="arrow-forward-circle-outline" size={28} color="#999999" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={modalStyles.viewAllButton} onPress={() => console.log('View all pressed')}>
              <Text style={modalStyles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// --- Custom Header Component ---

interface CustomHeaderProps {
  avatarUri?: string; // Optional avatar URL
}

export default function CustomHeader({ avatarUri }: CustomHeaderProps) {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ✅ Get fullName from Redux
  const fullName = useSelector((state: RootState) => state.auth.user?.fullName); 

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Dynamic profile completion data
  const profileCompletion = 72; // Set to 72% as per the image example
  const progressWidth = `${profileCompletion}%`;

  // Define the steps for the modal
  const profileSteps: ProfileStep[] = [
    { id: 1, label: 'Basic Details', isCompleted: true, onPress: () => console.log('Nav to Add Address 1') },
    { id: 2, label: 'Professional Details', isCompleted: true, onPress: () => console.log('Nav to Confirm Email') },
    { id: 3, label: 'Family Details', isCompleted: true, onPress: () => console.log('Nav to Upload Resume') },
    { id: 4, label: 'Contct Details', isCompleted: false, onPress: () => console.log('Nav to Add Photo') },
    { id: 5, label: 'Partner Preferences', isCompleted: false, onPress: () => console.log('Nav to Add Experience') },
  ];


  return (
    <View>

      {/* --- Main Header Content --- */}
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

            {/* ✅ Dynamic fullName from Redux */}
            <Text style={styles.title}>
              {fullName ? fullName : 'Guest User'}
            </Text>

            {/* Profile completion progress bar and text */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                {/* 🎯 FIX APPLIED HERE: Casting to ViewStyle */}
                <View style={[styles.progressBarFill, { width: progressWidth } as ViewStyle]} />
              </View>
              <Text style={styles.progressText}>
                {profileCompletion}% Profile Completion
              </Text>
            </View>
          </View>
        </View>

        {/* Right: Drawer toggle */}
        <Pressable onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="black" />
        </Pressable>
      </View>

      {/* --- Complete Profile Button --- */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsModalVisible(true)} // Open the modal
        >
          <Text style={styles.createButtonText}>Complete your Profile</Text>
        </TouchableOpacity>
      </View>

      {/* --- Profile Completion Modal --- */}
      <ProfileCompletionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Close the modal
        steps={profileSteps}
        completionPercentage={profileCompletion}
      />
    </View>
  );
}

// --- Styles for CustomHeader ---

const styles = StyleSheet.create({
  header: {
    height: 130,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#66666622',
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
    color: 'black',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    width: 140,
    height: 8,
    backgroundColor: '#FFD9E8', // Pink light background
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF4189', // Pink fill color
    borderRadius: 4,
  },
  progressText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16, 
  },
  createButton: {
    width: '100%',
    backgroundColor: '#FFE3CB', // Orange light background
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#F18221', // Orange text color
    fontSize: 16,
    fontWeight: '600',
  },
});

// --- Styles for Modal ---

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5', 
    borderRadius: 8,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00BF41', // Green for profile completion modal
    borderRadius: 4,
  },
  stepsContainer: {
    paddingBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  stepIconContainer: {
    width: 30, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  viewAllButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  viewAllText: {
    color: '#3498DB', 
    fontSize: 16,
    fontWeight: '600',
  },
});