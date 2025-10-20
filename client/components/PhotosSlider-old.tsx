import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";

// --- Configuration Constants ---
const { width } = Dimensions.get("window");
// Significantly smaller card width to fit multiple on screen
const CARD_WIDTH = width * 0.28; // Approximately 3 cards with some spacing
const SPACING = width * 0.02; // Reduced spacing
const MAX_PHOTOS = 3;
// ⚠️ IMPORTANT: Replace this with your actual local network IP or domain
const API_URL = "http://192.168.43.38:5000"; 


// --- Types & Validation ---
type PhotoValues = {
  images: string[];
  photoPrivacy: "Public" | "Private"; // Keep type, but UI won't show it
};

type SlideItem = {
  uri?: string;
  isPlaceholder: boolean;
  originalIndex?: number;
};

const validationSchema = Yup.object().shape({
  images: Yup.array()
    .max(MAX_PHOTOS, `Maximum ${MAX_PHOTOS} photos allowed`),
  // photoPrivacy is not directly managed by this UI anymore, but can be managed by server logic
  // .min(1, "At least 1 image is required to set privacy"), // Removed min requirement for images
});

// --- Main Component ---
const ImageSliderForm: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [values, setValues] = useState<PhotoValues>({
    images: [],
    photoPrivacy: "Public", // Defaulting to Public as UI doesn't manage
  });
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<SlideItem>>(null);

  // ---------------- SCROLL HANDLERS ----------------
  // Note: These might not be as useful with very small cards, but keep for functionality
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

  // ---------------- FlatList Data preparation ----------------
  const displayedImages = values.images.slice(0, MAX_PHOTOS);

  const flatListData: SlideItem[] = displayedImages.map((uri, index) => ({
    uri,
    isPlaceholder: false,
    originalIndex: index,
  }));

  // Add the upload placeholder only if we haven't reached the limit
  if (values.images.length < MAX_PHOTOS) {
    flatListData.push({ uri: undefined, isPlaceholder: true }); 
  }

  // ---------------- Fetch user photos ----------------
  const fetchUserPhotos = async () => {
    try {
      const token = (await AsyncStorage.getItem("token")) || "";
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!token || !user?.id) return;

      const res = await fetch(`${API_URL}/user/${user.id}/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch photos");
      const data = await res.json();

      const photoUrls = (data.photos.profilePhotoUrls || [])
        .slice(0, MAX_PHOTOS) 
        .map((filePath: string) => `${API_URL}${filePath}`);

      setValues({
        images: photoUrls,
        photoPrivacy: data.photos?.photoPrivacy || "Public", // Still fetch for internal state if needed
      });
    } catch (err: any) {
      console.error("Fetch photos error:", err);
    }
  };

  useEffect(() => {
    fetchUserPhotos();
  }, []);

  // ---------------- Upload helper ----------------
  const uploadImages = async (updatedImages: string[], photoPrivacy: "Public" | "Private") => {
    try {
      const token = (await AsyncStorage.getItem("token")) || "";
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!token || !user?.id) return;

      // Validate only image array length, not privacy since UI doesn't control it directly
      await validationSchema.validate({ images: updatedImages, photoPrivacy: values.photoPrivacy }); 

      const formData = new FormData();
      let filesToUploadCount = 0;

      updatedImages.forEach((uri, i) => {
        const isLocalFile = !uri.startsWith(API_URL);

        if (isLocalFile) {
          const filename = uri.split("/").pop() || `photo_${i}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpeg";
          formData.append("photos", { uri, name: filename, type } as any);
          filesToUploadCount++;
        }
      });

      // Always send the current photoPrivacy from state, even if UI doesn't have a toggle
      formData.append("photoPrivacy", photoPrivacy); 
      
      // Only make API call if there's an actual change (new image or privacy change)
      if (filesToUploadCount === 0 && values.photoPrivacy === photoPrivacy && updatedImages.length === values.images.length) return;

      setLoading(true);
      const response = await fetch(`${API_URL}/user/${user.id}/photos`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("✅ Success", filesToUploadCount > 0 ? "Photos updated successfully!" : "Privacy updated successfully!");
        fetchUserPhotos(); 
      } else {
        Alert.alert("Error", data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setLoading(false);
      Alert.alert("Error", error.message || "Validation failed");
    }
  };

  // ---------------- Pick Image ----------------
  const pickImage = async (originalIndex?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      // You may want to prevent multiple selection if replacing an image
      allowsMultipleSelection: originalIndex === undefined, 
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const updatedImages = [...values.images];

      if (originalIndex !== undefined) {
        // Replace existing photo (the "pencil" functionality that's now a direct upload)
        updatedImages[originalIndex] = uri; 
      } else {
        // Add new photo (from placeholder or "Add Photos" button)
        updatedImages.push(uri); 
      }
      
      await uploadImages(updatedImages, values.photoPrivacy);
    }
  };
  
  // ---------------- Delete Image ----------------
  const performDelete = async (originalIndex: number) => {
    try {
      const token = (await AsyncStorage.getItem("token")) || "";
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!token || !user?.id) return;

      const photoToDelete = values.images[originalIndex];
      const relativePath = photoToDelete.replace(API_URL, ""); 

      setLoading(true);
      const response = await fetch(`${API_URL}/user/${user.id}/photos`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photoUrl: relativePath }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert("✅ Success", "Photo deleted successfully!");
        fetchUserPhotos(); 
      } else {
        Alert.alert("Error", data.message || "Failed to delete photo");
      }
    } catch (error: any) {
      console.error("Delete photo error:", error);
      setLoading(false);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const removeImage = (originalIndex: number) => {
    Alert.alert(
      "Confirm Delete",
      "Do you want to permanently delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, Delete", style: "destructive", onPress: () => performDelete(originalIndex) },
      ],
      { cancelable: true }
    );
  };

  // ---------------- Render Image Card Helper ----------------
  const renderImageCard = (item: SlideItem) => {
    if (item.isPlaceholder) {
      return (
        // Upload Placeholder Card (matches screenshot text)
        <TouchableOpacity style={[styles.imageCard, styles.placeholder]} onPress={() => pickImage()}>
          <Ionicons name="cloud-upload-outline" size={30} color="#45A049" />
          <Text style={styles.uploadText}>Upload Photo</Text>
          <Text style={[styles.limitText, { fontWeight: "bold" }]}>(Max {MAX_PHOTOS} photos)</Text>
          <Text style={styles.limitText}>each photo max 2MB</Text>
        </TouchableOpacity>
      );
    }
    
    // Existing Image Card (only delete button, no replace)
    return (
      <View style={styles.imageCardContainer}>
        <Image 
          source={{ uri: `${item.uri}?t=${new Date().getTime()}` }} 
          style={styles.imageCard} 
        />
        
        {/* Delete Button (Close Circle Icon) */}
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => removeImage(item.originalIndex!)} 
          disabled={loading}
        >
          <Ionicons name="close-circle" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  }

  // ---------------- Component Output ----------------
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Updating Photos...</Text>
        </View>
      )}
      
      <View style={styles.sliderWrapper}>
        <FlatList
          ref={flatListRef}
          data={flatListData} 
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          // snapToInterval is less useful for a compact grid where multiple items are visible
          // snapToAlignment="center" // Removed as it might interfere with compact look
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => renderImageCard(item)}
        />
      </View>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {flatListData.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
            <View style={[styles.dot, currentIndex === index && styles.activeDot]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* "Add Photos" Button - Visible if space is available and not loading */}
      {values.images.length < MAX_PHOTOS && !loading && (
        <TouchableOpacity 
          style={styles.addPhotosButton} 
          onPress={() => pickImage()} // Calls pickImage without originalIndex to add new
        >
          <Text style={styles.addPhotosButtonText}>Add Photos</Text>
        </TouchableOpacity>
      )}

      {/* Removed Privacy Toggle to match screenshot */}

    </View>
  );
};

export default ImageSliderForm;

// --- Stylesheet (UPDATED to match screenshot UI) ---
const styles = StyleSheet.create({
  container: { paddingVertical: 20, backgroundColor: '#f9f9f9', alignItems: 'center' }, // Centered container
  sliderWrapper: { width: width }, 
  flatListContent: { 
    // Adjust padding to center the content if there are fewer than 3 items,
    // otherwise, allow scrolling to naturally align.
    justifyContent: 'center', // Helps center items when there are few
    alignItems: 'center', // Helps center items vertically if card heights vary
    paddingHorizontal: SPACING, // Consistent spacing on edges
  },
  imageCardContainer: { 
    marginHorizontal: SPACING / 2, // Even tighter spacing
    position: "relative",
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2, // Rectangular card, slightly taller
    borderRadius: 12,
    overflow: 'hidden', // Ensures rounded corners
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: 'white',
  },
  imageCard: { 
    width: '100%',
    height: '100%', 
    borderRadius: 12,
    resizeMode: 'cover',
  },
  placeholder: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    backgroundColor: "#fff", // White background for placeholder
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, // Dotted border
    borderColor: "#FF7F50", // Orange border color
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 5, // Smaller padding inside
  },
  uploadText: { marginTop: 5, fontWeight: "600", fontSize: 12, color: "#000", textAlign: 'center' },
  limitText: { fontSize: 10, marginTop: 2, color: "#FF7F50", textAlign: 'center' },
  dotsContainer: { flexDirection: "row", alignSelf: "center", paddingVertical: 10, marginTop: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#ccc", marginHorizontal: 3 },
  activeDot: { backgroundColor: "#4CAF50", width: 8, borderRadius: 4 },
  deleteButton: { 
    position: "absolute", 
    top: 5, // Closer to top edge
    right: 5, // Closer to right edge
    zIndex: 10, 
    backgroundColor: 'white', 
    padding: 1, // Smaller padding
    borderRadius: 12,
  },
  // Removed replaceButton as per UI spec
  addPhotosButton: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20, // Space below slider
    width: '80%', // Make it wide
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addPhotosButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  }
});