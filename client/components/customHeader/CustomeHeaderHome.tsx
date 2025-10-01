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
  LayoutAnimation, 
  UIManager, 
  Platform, 
  TextInput, 
  ViewStyle 
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from "expo-router";


// 👇 enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Interface for Modal Step Data ---
interface ProfileStep {
  id: number;
  label: string;
  isCompleted: boolean;
}

interface ProfileCompletionModalProps {
  isVisible: boolean;
  onClose: () => void;
  steps: ProfileStep[];
  completionPercentage: number;
}

// --- Profile Completion Modal Component ---
const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isVisible, onClose, steps, completionPercentage }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedStep(expandedStep === id ? null : id);
  };

  const progressWidth = `${completionPercentage}%`;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable style={modalStyles.centeredView} onPress={onClose}>
        <Pressable style={modalStyles.modalView} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Complete your profile</Text>
            <Text style={modalStyles.subtitle}>
              By completing all the details you have a higher chance of being seen by recruiters.
            </Text>

            <View style={modalStyles.progressBarContainer}>
              <Text style={modalStyles.percentageText}>{completionPercentage}%</Text>
              <View style={modalStyles.progressBar}>
                <View style={[modalStyles.progressBarFill, { width: progressWidth } as ViewStyle]} />
              </View>
            </View>
          </View>

          {/* Steps */}
     {/* Steps */}
<ScrollView contentContainerStyle={modalStyles.stepsContainer}>
  {steps.map((step) => (
    <View key={step.id}>
      {/* Step Header */}
      <TouchableOpacity 
        style={modalStyles.stepItem} 
        onPress={() => toggleStep(step.id)}
      >
        <View style={modalStyles.stepIconContainer}>
          {step.isCompleted ? (
            <Ionicons name="checkmark-circle" size={24} color="#00BF41" />
          ) : (
            <MaterialCommunityIcons name="circle-outline" size={24} color="#666666" />
          )}
        </View>
        <Text style={modalStyles.stepText}>{step.label}</Text>
        <Ionicons 
          name={expandedStep === step.id ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#999" 
        />
      </TouchableOpacity>

      {/* Expanded Content */}
      {expandedStep === step.id && (
        <View style={modalStyles.formContainer}>
          {step.id === 1 && (
            <>
              <TextInput placeholder="Name" style={modalStyles.input} />
              <TextInput placeholder="Age" style={modalStyles.input} keyboardType="numeric" />
              <TextInput placeholder="Gender" style={modalStyles.input} />
            </>
          )}
          {step.id === 2 && (
            <>
              <TextInput placeholder="Job Title" style={modalStyles.input} />
              <TextInput placeholder="Company" style={modalStyles.input} />
            </>
          )}
          {step.id === 3 && (
            <>
              <TextInput placeholder="Father’s Name" style={modalStyles.input} />
              <TextInput placeholder="Mother’s Occupation" style={modalStyles.input} />
            </>
          )}
          {step.id === 4 && (
            <>
              <TextInput placeholder="Phone Number" style={modalStyles.input} keyboardType="phone-pad" />
              <TextInput placeholder="Email Address" style={modalStyles.input} keyboardType="email-address" />
            </>
          )}
          {step.id === 5 && (
            <>
              <TextInput placeholder="Preferred Partner Age" style={modalStyles.input} keyboardType="numeric" />
              <TextInput placeholder="Preferred City" style={modalStyles.input} />
            </>
          )}
        </View>
      )}
    </View>
  ))}

  {/* --- Save Button --- */}
  <TouchableOpacity 
    style={modalStyles.saveButton} 
    onPress={() => console.log("Save clicked")}
  >
    <Text style={modalStyles.saveButtonText}>Save</Text>
  </TouchableOpacity>
</ScrollView>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

// --- Custom Header Component ---
interface CustomHeaderProps {
  avatarUri?: string; 
}

export default function CustomHeader({ avatarUri }: CustomHeaderProps) {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fullName = useSelector((state: RootState) => state.auth.user?.fullName); 

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const profileCompletion = 72; 
  const progressWidth = `${profileCompletion}%`;

  const profileSteps: ProfileStep[] = [
    { id: 1, label: 'Basic Details', isCompleted: true },
    { id: 2, label: 'Professional Details', isCompleted: true },
    { id: 3, label: 'Family Details', isCompleted: false },
    { id: 4, label: 'Contact Details', isCompleted: false },
    { id: 5, label: 'Partner Preferences', isCompleted: false },
  ];
  const router = useRouter(); // 👈 useRouter instead of useNavigation

  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
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

            <Text style={styles.title}>
              {fullName ? fullName : 'Guest User'}
            </Text>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { width: progressWidth } as ViewStyle]} />
              </View>
              <Text style={styles.progressText}>
                {profileCompletion}% Profile Completion
              </Text>
            </View>
          </View>
        </View>

        <Pressable onPress={openDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="black" />
        </Pressable>
      </View>

      {/* Complete Profile Button */}
      <View style={styles.buttonWrapper}>
    <TouchableOpacity
      style={styles.createButton}
      onPress={() => router.navigate("/(drawer)/(tabs)/ProfileForm")}
    >
      <Text style={styles.createButtonText}>Complete your Profile</Text>
    </TouchableOpacity>


      </View>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        steps={profileSteps}
        completionPercentage={profileCompletion}
      />
    </View>
  );
}

// --- Styles ---
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
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc', marginRight: 10 },
  greetingContainer: { flexDirection: 'column' },
  helloRow: { flexDirection: 'row', alignItems: 'center' },
  helloText: { color: 'black', fontSize: 16, fontWeight: '600' },
  handIcon: { marginLeft: 6 },
  title: { color: 'black', fontSize: 24, fontWeight: 'bold' },
  menuButton: { padding: 8, color: 'black' },
  progressBarContainer: { marginTop: 8 },
  progressBar: { width: 140, height: 8, backgroundColor: '#FFD9E8', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#FF4189', borderRadius: 4 },
  progressText: { marginTop: 4, fontSize: 12, color: '#666666', fontWeight: '600' },
  buttonWrapper: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 16 },
  createButton: { width: '100%', backgroundColor: '#FFE3CB', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  createButtonText: { color: '#F18221', fontSize: 16, fontWeight: '600' },
});

const modalStyles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalView: { width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#F5F5F5', borderRadius: 8 },
  percentageText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginRight: 10 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#00BF41', borderRadius: 4 },
  stepsContainer: { paddingBottom: 20 },
  stepItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  stepIconContainer: { width: 30, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  stepText: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
  formContainer: { padding: 10, backgroundColor: '#FAFAFA', borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 10, fontSize: 14 },saveButton: {
  marginTop: 20,
  backgroundColor: '#F18221', // same orange as before
  paddingVertical: 14,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
saveButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

});
