import React, { useState } from "react";
import { View, ScrollView, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

import CustomHeader from "@/components/customHeader/CustomHeader";
import ImageSlider from "@/components/PhotosSlider"; // your component
import BasicForm from "@/components/Forms/basicForm";
import ProfessionalForm from "@/components/Forms/ProfessionalForm";
import FamilyDetails from "@/components/Forms/FamilyDetails";
import ContactDetails from "@/components/Forms/ContactDetails";
import PartnerPreferences from "@/components/Forms/PartnerPreferences";

const CreateProfileForm: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]); // 3 photo slots

  const openModal = (formName: string) => setActiveModal(formName);
  const closeModal = () => setActiveModal(null);

  // Pick image from gallery
  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;

        // find first empty slot or replace the last one
        setPhotos((prev) => {
          const updated = [...prev];
          const emptyIndex = updated.findIndex((p) => p === null);
          if (emptyIndex !== -1) updated[emptyIndex] = selectedUri;
          else updated[updated.length - 1] = selectedUri;
          return updated;
        });
      }
    } catch (error) {
      console.error("Image picking failed:", error);
    }
  };

  const sections = [
    { title: "Basic Details", form: <BasicForm onClose={closeModal} /> },
    { title: "Professional Details", form: <ProfessionalForm onClose={closeModal} /> },
    { title: "Family Details", form: <FamilyDetails onClose={closeModal} /> },
    { title: "Contact Details", form: <ContactDetails onClose={closeModal} /> },
    { title: "Partner Preferences", form: <PartnerPreferences onClose={closeModal} /> },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader title="Create Profile" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 🔹 Top Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.photoTitle}>Profile Photos</Text>
          <ImageSlider images={photos} onAddPhoto={handleAddPhoto} />
        </View>

        {/* 🔹 Form Sections */}
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sectionBox}
            onPress={() => openModal(section.title)}
          >
            <Text style={styles.sectionText}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔹 Reusable Modal */}
      {sections.map((section, index) => (
        <Modal
          key={index}
          visible={activeModal === section.title}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{section.title}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>{section.form}</ScrollView>
          </View>
        </Modal>
      ))}
    </View>
  );
};

export default CreateProfileForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { paddingVertical: 20 },
  photoSection: { paddingHorizontal: 16, marginBottom: 20 },
  photoTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#333" },
  sectionBox: {
    backgroundColor: "#f4f4f4",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionText: { fontSize: 16, fontWeight: "600", color: "#333" },
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  closeText: { fontSize: 20, color: "#555" },
});
