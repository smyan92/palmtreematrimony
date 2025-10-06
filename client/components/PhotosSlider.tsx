import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = width * 0.05;

type ImageDataType = string;
const MAX_PHOTOS = 3;

const ImageSlider: React.FC = () => {
  const [images, setImages] = useState<ImageDataType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
    );
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * (CARD_WIDTH + SPACING),
      animated: true,
    });
  };

  const pickImage = async (replaceIndex?: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImages(prev => {
        const newImages = [...prev];
        if (replaceIndex !== undefined) {
          newImages[replaceIndex] = uri; // replace
        } else if (prev.length < MAX_PHOTOS) {
          newImages.push(uri); // add
        } else {
          newImages[0] = uri; // replace first if max reached
        }
        return newImages;
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderUploadPlaceholder = () => (
    <TouchableOpacity
      style={[styles.imageCard, styles.placeholder]}
      onPress={() => pickImage()}
      activeOpacity={0.8}
    >
      <Ionicons name="cloud-upload-outline" size={36} color="#45A049" />
      <Text style={styles.uploadText}>Upload Photo</Text>
      <Text style={[styles.limitText, { fontWeight: 'bold' }]}>
        (Max {MAX_PHOTOS} photos)
      </Text>
      <Text style={styles.limitText}>each photo max 2MB</Text>
    </TouchableOpacity>
  );

  const renderImageItem = (item: ImageDataType, imageIndex: number) => (
    <View style={styles.imageCardContainer}>
      <Image source={{ uri: item }} style={styles.imageCard} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeImage(imageIndex)}
      >
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.replaceButton}
        onPress={() => pickImage(imageIndex)}
      >
        <Ionicons name="pencil" size={20} color="#007bff" />
      </TouchableOpacity>
    </View>
  );

  const flatListData: (string | 'placeholder')[] =
    images.length < MAX_PHOTOS ? ['placeholder', ...images] : [...images];

  return (
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
          item === 'placeholder'
            ? renderUploadPlaceholder()
            : renderImageItem(item as string, index - (images.length < MAX_PHOTOS ? 1 : 0))
        }
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {flatListData.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToSlide(index)}>
            <View
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginVertical: 8,
  },
  flatListContent: {
    paddingHorizontal: SPACING / 2,
  },
  imageCardContainer: {
    marginHorizontal: SPACING / 2,
    position: 'relative',
  },
  imageCard: {
    width: 150,
    height: 200,
    borderRadius: 16,
  },
  placeholder: {
    width: 150,
    height: 200,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF7F50',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 10,
  },
  uploadText: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  limitText: {
    fontSize: 12,
    marginTop: 4,
    color: '#FF7F50',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: -15,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
    width: 12,
    borderRadius: 6,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: -8,
  },
  replaceButton: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 12,
  },
});
