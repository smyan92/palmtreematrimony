import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const SPACING = width * 0.05;
const MAX_PHOTOS = 3;
const API_URL = "http://192.168.43.38:5000";

type PhotoValues = {
  images: string[];
  photoPrivacy: "Public" | "Private";
};

const validationSchema = Yup.object().shape({
  images: Yup.array()
    .min(1, "At least 1 image is required")
    .max(MAX_PHOTOS, `Maximum ${MAX_PHOTOS} photos allowed`),
  photoPrivacy: Yup.string().oneOf(["Public", "Private"]).required("Select privacy"),
});

const ImageSliderForm: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * (CARD_WIDTH + SPACING),
      animated: true,
    });
  };

  const pickImageFormik = async (values: PhotoValues, setFieldValue: (field: string, value: any) => void, index?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const updatedImages = [...values.images];
      if (index !== undefined) updatedImages[index] = uri;
      else updatedImages.push(uri);
      setFieldValue("images", updatedImages);
    }
  };

  const removeImageFormik = (values: PhotoValues, setFieldValue: (field: string, value: any) => void, index: number) => {
    const updatedImages = [...values.images];
    updatedImages.splice(index, 1);
    setFieldValue("images", updatedImages);
  };

const handleUpload = async (values: PhotoValues) => {
  try {
    const token = (await AsyncStorage.getItem("token")) || "";
    const userString = await AsyncStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user?.id) {
      Alert.alert("Error", "Please login first.");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < values.images.length; i++) {
      const uri = values.images[i];
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("photos", {
        uri,
        name: filename,
        type,
      } as any);
    }

    formData.append("photoPrivacy", values.photoPrivacy);

    const response = await fetch(`${API_URL}/users/${user.id}/photos`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type manually — fetch will set multipart/form-data automatically
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", "Photos uploaded successfully!");
    } else {
      Alert.alert("Error", data.message || "Upload failed");
    }
  } catch (error: any) {
    console.error(error);
    Alert.alert("Error", error.message || "Something went wrong");
  }
};


  return (
    <Formik<PhotoValues>
      initialValues={{ images: [], photoPrivacy: "Public" }}
      validationSchema={validationSchema}
      onSubmit={handleUpload}
    >
      {({ values, setFieldValue, handleSubmit, errors, touched, isSubmitting }) => {
        const flatListData: (string | "placeholder")[] =
          values.images.length < MAX_PHOTOS ? ["placeholder", ...values.images] : [...values.images];

        return (
          <View>
            {/* Image Slider */}
            <View style={styles.container}>
              <FlatList
                ref={flatListRef}
                data={flatListData}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + SPACING}
                snapToAlignment="start"
                contentContainerStyle={styles.flatListContent}
                renderItem={({ item, index }) =>
                  item === "placeholder" ? (
                    <TouchableOpacity
                      style={[styles.imageCard, styles.placeholder]}
                      onPress={() => pickImageFormik(values, setFieldValue)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="cloud-upload-outline" size={36} color="#45A049" />
                      <Text style={styles.uploadText}>Upload Photo</Text>
                      <Text style={[styles.limitText, { fontWeight: "bold" }]}>
                        (Max {MAX_PHOTOS} photos)
                      </Text>
                      <Text style={styles.limitText}>each photo max 2MB</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.imageCardContainer}>
                      <Image source={{ uri: item as string }} style={styles.imageCard} />
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeImageFormik(values, setFieldValue, index - 1)}
                      >
                        <Ionicons name="close-circle" size={24} color="#FF3B30" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.replaceButton}
                        onPress={() => pickImageFormik(values, setFieldValue, index - 1)}
                      >
                        <Ionicons name="pencil" size={20} color="#007bff" />
                      </TouchableOpacity>
                    </View>
                  )
                }
              />

              {/* Dots */}
              <View style={styles.dotsContainer}>
                {flatListData.map((_, index) => (
                  <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
                    <View style={[styles.dot, currentIndex === index && styles.activeDot]} />
                  </TouchableOpacity>
                ))}
              </View>
              {errors.images && touched.images && (
                <Text style={{ color: "red", marginTop: 5 }}>{errors.images}</Text>
              )}
            </View>

            {/* Privacy Toggle */}
            <View style={styles.privacyContainer}>
              {["Public", "Private"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.privacyButton, values.photoPrivacy === type && styles.activePrivacyButton]}
                  onPress={() => setFieldValue("photoPrivacy", type)}
                >
                  <Text style={[styles.privacyText, values.photoPrivacy === type && { color: "#fff" }]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.photoPrivacy && touched.photoPrivacy && (
              <Text style={{ color: "red", marginTop: 5 }}>{errors.photoPrivacy}</Text>
            )}

            {/* Save Button */}
            <View style={styles.saveButtonContainer}>
              {isSubmitting ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : (
                <Button title="Save Images" color="#4CAF50" onPress={() => handleSubmit()} />
              )}
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

export default ImageSliderForm;

const styles = StyleSheet.create({
  container: { height: 220, marginVertical: 8, marginBottom: 20 },
  flatListContent: { paddingHorizontal: SPACING / 2 },
  imageCardContainer: { marginHorizontal: SPACING / 2, position: "relative" },
  imageCard: { width: 150, height: 200, borderRadius: 16 },
  placeholder: {
    width: 150,
    height: 200,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF7F50",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 10,
  },
  uploadText: { marginTop: 8, fontWeight: "600", fontSize: 16, color: "#000" },
  limitText: { fontSize: 12, marginTop: 4, color: "#FF7F50" },
  dotsContainer: { position: "absolute", bottom: -15, flexDirection: "row", alignSelf: "center", paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ccc", marginHorizontal: 3 },
  activeDot: { backgroundColor: "#4CAF50", width: 12, borderRadius: 6 },
  deleteButton: { position: "absolute", top: 10, right: -8 },
  replaceButton: { position: "absolute", bottom: 25, right: 10, backgroundColor: "#fff", padding: 4, borderRadius: 12 },
  saveButtonContainer: { alignSelf: "center", width: "95%", marginTop: 10 },
  privacyContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10, gap: 10 },
  privacyButton: { paddingVertical: 8, paddingHorizontal: 20, borderWidth: 1, borderColor: "#4CAF50", borderRadius: 8 },
  activePrivacyButton: { backgroundColor: "#4CAF50" },
  privacyText: { color: "#000", fontWeight: "600" },
});
