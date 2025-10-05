import React, {useState } from "react";
import { View, ScrollView, Alert  } from "react-native";
import CustomHeader from '@/components/customHeader/CustomHeader';
import Collapse from "@/components/collapse";
import BasicForm from "@/components/Forms/basicForm";
import ProfessionalForm from "@/components/Forms/ProfessionalForm";
import FamilyDetails from "@/components/Forms/FamilyDetails";
import ContactDetails from "@/components/Forms/ContactDetails";
import PartnerPreferences from "@/components/Forms/PartnerPreferences";
import ImageSlider from '@/components/PhotosSlider'; // Assuming this points to the fixed component



const ProfileForm = () => {
  // Removed unused state, as imagesData is hardcoded below
  // const [images, setImages] = useState<(string | null)[]>([null, null, null]);
  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Here you can open image picker');
  };

const girl1Asset = require('../../../assets/images/girl1.jpg'); 
const girl2Asset = require('../../../assets/images/girl2.jpg'); 

const imagesData = [
  null,          // 👈 Slot 1: Renders the Upload Photo placeholder
  girl1Asset,    // 👈 Slot 2: Renders the first local image
  girl2Asset,    // 👈 Slot 3: Renders the second local image
  // OR use a remote URL: "https://your.remote.server/image.png" 
];


  return (
    <View style={{ flex: 1 }}>
      {/* Fixed Header */}
      <CustomHeader title="Profile Details" showBackButton />
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
 <ImageSlider 
  images={imagesData} 
  onAddPhoto={() => { /* Image Picker logic */ }} 
/>
        <Collapse title="Basic & Horoscope Details">
          <BasicForm />
        </Collapse>

        <Collapse title="Professional & Education">
          <ProfessionalForm />
        </Collapse>

        <Collapse title="Family Details">
          <FamilyDetails />
        </Collapse>

        <Collapse title="Contact Details">
          <ContactDetails />
        </Collapse>

        <Collapse title="Partner Preference">
          <PartnerPreferences />
        </Collapse>
      </ScrollView>
    </View>
  );
};

export default ProfileForm;