import React, { useRef, useState, useEffect } from "react";
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Modal,
    StatusBar,
    Platform,
    Alert,
    ActivityIndicator, 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

// 🎯 BASE URL: Replace with your actual server IP/domain
const API_BASE_URL = "http://192.168.43.38:5000"; 

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = 150;
const MAX_PHOTOS = 3;

type Props = {
    onChange: (photos: string[]) => void;
    onPrivacyChange?: (privacy: "Public" | "Private") => void;
    initialPrivacy?: "Public" | "Private";
};

const PhotoUploader: React.FC<Props> = ({
    onChange,
    // onPrivacyChange, // Not currently used
    initialPrivacy = "Public",
}) => {
    // === State and Refs ===
    const [photos, setPhotos] = useState<string[]>([]);
    const [photoPrivacy, setPhotoPrivacy] = useState<"Public" | "Private">(
        initialPrivacy
    );
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const previewFlatListRef = useRef<FlatList>(null);

    // === Helper Functions ===

    // Helper: Gets the true index of the photo array, adjusting for the placeholder card
    const getOriginalIndex = (flatListIndex: number) => {
        return photos.length < MAX_PHOTOS ? flatListIndex - 1 : flatListIndex;
    };

    // Helper function to extract relative path (e.g., /uploads/users/id/file.jpg) from the full URI
    const getRelativePhotoUrl = (fullUri: string): string => {
        const baseUrlRegex = new RegExp(`^${API_BASE_URL}`); 
        return fullUri.replace(baseUrlRegex, "");
    };

    // === Data Fetching (Runs on Mount) ===

    const fetchPhotos = async () => {
        setIsLoading(true);
        try {
            const token = (await AsyncStorage.getItem("token")) || "";
            const userString = await AsyncStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;

            if (!user || !user.id) {
                setIsLoading(false);
                return;
            }
            const userId = user.id;

            const response = await fetch(`${API_BASE_URL}/user/${userId}/photos`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Access the photo array at the correct nested path
                const relativePaths = data.photos?.profilePhotoUrls;
                const privacy = data.photos?.photoPrivacy;

                if (Array.isArray(relativePaths)) {
                    
                    const fullUris = relativePaths.map((path: string) => {
                        let correctedPath = path;

                        // FIX: Standardize old paths (e.g., "/uploads/filename.jpg") 
                        // to the new secure format ("/uploads/users/id/filename.jpg")
                        if (path.startsWith('/uploads/') && !path.includes(`/users/${userId}/`)) {
                            const filenameSegment = path.substring('/uploads/'.length);
                            correctedPath = `/uploads/users/${userId}/${filenameSegment}`;
                        }
                        
                        // Return the full URI using the corrected path
                        return `${API_BASE_URL}${correctedPath}`; 
                    });

                    setPhotos(fullUris);
                    onChange?.(fullUris);
                    setPhotoPrivacy(privacy || initialPrivacy);

                } else {
                    console.error("Fetch photos failed: 'profilePhotoUrls' field missing.", data);
                    Alert.alert("Error", "Server returned invalid photo list structure.");
                }
            } else {
                console.error("Fetch photos failed:", data.message || "Unknown server error", data);
                Alert.alert("Error", data.message || "Failed to fetch photos.");
            }

        } catch (error) {
            console.error("Error fetching photos:", error);
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    // === API Calls: Upload and Delete ===

    /**
     * Handles the actual API upload of a single photo file.
     */
/**
 * Upload a single photo (new or replacement)
 */
const uploadPhoto = async (
  imageUri: string,
  privacyStatus: "Public" | "Private",
  indexToReplace?: number,
  filename: string = "Photo"
) => {
  try {
    setIsLoading(true);

    const token = (await AsyncStorage.getItem("token")) || "";
    const userString = await AsyncStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || !user.id) {
      Alert.alert("Error", "User not logged in");
      setIsLoading(false);
      return;
    }

    const userId = user.id;

    const formData = new FormData();
    formData.append("photoPrivacy", privacyStatus);
    formData.append("photos", {
      uri: imageUri,
      name: filename,
      type: "image/jpeg",
    } as any);

    const response = await fetch(`${API_BASE_URL}/user/${userId}/photos`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      // Server returns full updated list of photo URLs (relative)
      const relativePaths = data.photos?.profilePhotoUrls;

      if (Array.isArray(relativePaths)) {
        const fullUris = relativePaths.map((path: string) => `${API_BASE_URL}${path}`);
        setPhotos(fullUris);
        onChange?.(fullUris);
        setPhotoPrivacy(data.photos?.photoPrivacy || privacyStatus);

        // ✅ Show success message (just filename)
        Alert.alert("✅ Success", `${filename} uploaded successfully!`);
      } else {
        Alert.alert("Error", "Invalid server response");
      }
    } else {
      console.error("Upload failed:", data);
      Alert.alert("Upload Error", data.message || "Could not upload photo");
    }
  } catch (error) {
    console.error("Upload error:", error);
    Alert.alert("Network Error", "Failed to upload photo");
  } finally {
    setIsLoading(false);
  }
};

    /**
     * Opens the image picker and triggers the upload.
     * @param indexToReplace The index of the photo being replaced, or undefined if adding a new one.
     */
const pickImage = async (indexToReplace?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
        const imageAsset = result.assets[0];
        const newUri = imageAsset.uri;
        
        // Extract the filename 
        const filename = newUri.split("/").pop() || "Photo"; 

        // Pass the filename 
        await uploadPhoto(newUri, photoPrivacy, indexToReplace, filename); 
    }
};

    /**
     * Deletes a photo from the server and local state.
     */
    const removePhoto = async (index: number) => {
        const photoToDelete = photos[index];
        const photoUrl = getRelativePhotoUrl(photoToDelete); // e.g. "/uploads/users/..."

        const token = (await AsyncStorage.getItem("token")) || "";
        const userString = await AsyncStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        if (!user || !user.id) {
            Alert.alert("Error", "User not logged in or ID not found for deletion.");
            return;
        }
        const userId = user.id;

        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this photo?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(
                                `${API_BASE_URL}/user/${userId}/photos`,
                                {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ photoUrl }),
                                }
                            );

                            const data = await response.json();

                            if (response.ok) {
                                const updated = photos.filter((_, i) => i !== index);
                                setPhotos(updated);
                                onChange?.(updated);
                                Alert.alert("🗑️ Success", "Photo deleted successfully!");
                            } else {
                                console.error("Deletion failed data:", data);
                                Alert.alert(
                                    "Error",
                                    data.message || "Photo deletion failed on server."
                                );
                            }
                        } catch (error) {
                            console.error("Deletion error:", error);
                            Alert.alert(
                                "Error",
                                "An unexpected error occurred during photo deletion."
                            );
                        }
                    },
                },
            ]
        );
    };

    // === UI Logic (Scroll/Modal) ===
    
    const handleScroll = (event: any) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / (CARD_WIDTH + 20)
        );
        setCurrentIndex(index);
    };

    const handlePreviewScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setPreviewIndex(index);
    };

    const openPreview = (originalIndex: number) => {
        setPreviewIndex(originalIndex);
        setModalVisible(true);
    };

    useEffect(() => {
        if (modalVisible && previewFlatListRef.current) {
            const delay = Platform.OS === "ios" ? 10 : 100;
            setTimeout(() => {
                previewFlatListRef.current?.scrollToIndex({
                    index: previewIndex,
                    animated: false,
                });
            }, delay);
        }
    }, [modalVisible, previewIndex]);

    // === Rendering Helpers ===

    const renderPrivacyToggle = () => (
        <View style={styles.privacyContainer}>
            <Text style={styles.privacyLabel}>Photo Visibility:</Text>
            <TouchableOpacity
                style={[
                    styles.privacyButton,
                    photoPrivacy === "Public" && styles.activePrivacyButton,
                ]}
                onPress={() => setPhotoPrivacy("Public")}
            >
                <Text
                    style={[
                        styles.privacyButtonText,
                        photoPrivacy === "Public" && styles.activePrivacyButtonText,
                    ]}
                >
                    Public
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.privacyButton,
                    photoPrivacy === "Private" && styles.activePrivacyButton,
                ]}
                onPress={() => setPhotoPrivacy("Private")}
            >
                <Text
                    style={[
                        styles.privacyButtonText,
                        photoPrivacy === "Private" && styles.activePrivacyButtonText,
                    ]}
                >
                    Private
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderImagePreviewModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <StatusBar hidden />
            <View style={modalStyles.modalContainer}>
                <TouchableOpacity
                    style={modalStyles.closeButton}
                    onPress={() => setModalVisible(false)}
                >
                    <Ionicons name="close-circle-sharp" size={40} color="white" />
                </TouchableOpacity>

                <FlatList
                    ref={previewFlatListRef}
                    data={previewData}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => i.toString()}
                    onScroll={handlePreviewScroll}
                    renderItem={({ item }) => (
                        <View style={modalStyles.slide}>
                            <Image
                                source={{ uri: item as string }}
                                style={modalStyles.fullImage}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                />

                {/* Dots inside modal */}
                <View style={modalStyles.previewDotsContainer}>
                    {previewData.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                modalStyles.previewDot,
                                i === previewIndex && modalStyles.previewActiveDot,
                            ]}
                        />
                    ))}
                </View>
            </View>
        </Modal>
    );
    
    // === Main Render ===
    
    const flatListData =
        photos.length < MAX_PHOTOS ? ["placeholder", ...photos] : photos;
    const previewData = photos; // Data for the modal

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2ecc71" />
                <Text style={{ marginTop: 10, color: '#666' }}>Loading Photos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderImagePreviewModal()}
            {renderPrivacyToggle()} 

            <FlatList
                ref={flatListRef}
                data={flatListData}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                onScroll={handleScroll}
                snapToInterval={CARD_WIDTH + 20}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={({ item, index }) =>
                    item === "placeholder" ? (
                        <TouchableOpacity
                            style={[styles.card, styles.placeholder]}
                            onPress={() => pickImage()} // No index, means ADD
                        >
                            <Ionicons name="cloud-upload-outline" size={40} color="#2ecc71" />
                            <Text style={styles.text}>Upload Photo</Text>
                            <Text style={styles.subtext}>Max {MAX_PHOTOS} photos • 2MB each</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.cardWrapper}>
                            <TouchableOpacity
                                onPress={() => openPreview(getOriginalIndex(index))}
                            >
                                <Image 
                                    source={{ uri: item as string }} 
                                    style={styles.card} 
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => removePhoto(getOriginalIndex(index))}
                            >
                                <Ionicons name="close-circle" size={24} color="#ff2807ff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.replaceBtn}
                                // Calls pickImage, passing the index of the photo to be replaced
                                onPress={() => pickImage(getOriginalIndex(index))} 
                            >
                                <Ionicons name="pencil-sharp" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )
                }
            />

            {/* Dots */}
            <View style={styles.dots}>
                {flatListData.map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, i === currentIndex && styles.activeDot]}
                    />
                ))}
            </View>
        </View>
    );
};

export default PhotoUploader;

// --- Styles ---
const styles = StyleSheet.create({
    container: { alignItems: "center" },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 250, 
    },
    cardWrapper: { marginHorizontal: 10, position: "relative" },
    card: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 16,
        backgroundColor: "#f9f9f9",
    },
    placeholder: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2ecc71",
        borderStyle: "dashed",
    },
    text: { fontWeight: "bold", color: "#2ecc71", marginTop: 10 },
    subtext: { fontSize: 12, color: "#999", textAlign: "center", marginTop: 4 },
    deleteBtn: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 2,
        zIndex: 1,
    },
    replaceBtn: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "rgba(8, 146, 49, 0.6)",
        borderRadius: 15,
        padding: 5,
        zIndex: 1,
    },
    dots: { flexDirection: "row", marginVertical: 10 },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 3,
    },
    activeDot: { backgroundColor: "#2ecc71" },
    privacyContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 10,
    },
    privacyLabel: {
        fontSize: 16,
        marginRight: 15,
        fontWeight: "600",
        color: "#333",
    },
    privacyButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginHorizontal: 5,
    },
    activePrivacyButton: {
        backgroundColor: "#2ecc71",
        borderColor: "#2ecc71",
    },
    privacyButtonText: {
        color: "#333",
        fontWeight: "500",
    },
    activePrivacyButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
});

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    slide: { width, height: Dimensions.get("window").height, justifyContent: "center", alignItems: "center" },
    fullImage: { width: "100%", height: "100%" },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    previewDotsContainer: {
        position: "absolute",
        bottom: 40,
        flexDirection: "row",
        alignSelf: "center",
    },
    previewDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        marginHorizontal: 5,
    },
    previewActiveDot: { backgroundColor: "white" },
});