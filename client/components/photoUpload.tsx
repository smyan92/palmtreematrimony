import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface PhotoUploadProps {
  photos: string[];
  setPhotos: (photos: string[]) => void;
  maxPhotos?: number;
  maxSizeMB?: number;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  setPhotos,
  maxPhotos = 3,
  maxSizeMB = 2,
}) => {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Permission to access photos is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const sizeMB = (asset.fileSize || 0) / (1024 * 1024);

      if (sizeMB > maxSizeMB) {
        Alert.alert("File Too Large", `Each photo must be less than ${maxSizeMB} MB.`);
        return;
      }

      if (photos.length >= maxPhotos) {
        Alert.alert("Limit Reached", `You can only upload up to ${maxPhotos} photos.`);
        return;
      }

      setPhotos([...photos, asset.uri]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
        Upload Photos (Max {maxPhotos}, {maxSizeMB}MB each)
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {photos.map((uri, index) => (
          <View key={index} style={{ margin: 5, position: "relative" }}>
            <Image
              source={{ uri }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
            <TouchableOpacity
              onPress={() => removePhoto(index)}
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                backgroundColor: "red",
                borderRadius: 15,
                width: 25,
                height: 25,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        {photos.length < maxPhotos && (
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#eee",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 30, color: "#666" }}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PhotoUpload;
