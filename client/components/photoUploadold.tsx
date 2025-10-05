import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface PhotoUploadProps {
  label: string;
  photos?: string[]; // ✅ Optional, default handled below
  onChange: (newPhotos: string[]) => void;
  error?: string;
  touched?: boolean;
}

const MAX_PHOTOS = 3;
const MAX_SIZE_MB = 2;

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  label,
  photos = [], // ✅ default fallback prevents .map crash
  onChange,
  error,
  touched,
}) => {
  // --- pick a new photo ---
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const image = result.assets[0];
      const fileSizeMB = image.fileSize ? image.fileSize / (1024 * 1024) : 0;

      if (fileSizeMB > MAX_SIZE_MB) {
        Alert.alert("File too large", `Max ${MAX_SIZE_MB} MB allowed.`);
        return;
      }

      if (photos.length >= MAX_PHOTOS) {
        Alert.alert("Limit reached", `Only ${MAX_PHOTOS} photos allowed.`);
        return;
      }

      onChange([...photos, image.uri]);
    }
  };

  // --- remove photo ---
  const removeImage = (uri: string) => {
    onChange(photos.filter((p) => p !== uri));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.photoRow}>
        {photos.map((uri, idx) => (
          <View key={idx} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(uri)}>
              <Ionicons name="close-circle" size={20} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        ))}

        {photos.length < MAX_PHOTOS && (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Ionicons name="add" size={28} color="#007bff" />
          </TouchableOpacity>
        )}
      </View>

      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default PhotoUpload;

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontWeight: "600", marginBottom: 8 },
  photoRow: { flexDirection: "row", flexWrap: "wrap" },
  imageWrapper: { marginRight: 10, position: "relative" },
  image: { width: 80, height: 80, borderRadius: 10 },
  removeBtn: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  error: { color: "#dc3545", fontSize: 12, marginTop: 4 },
});
