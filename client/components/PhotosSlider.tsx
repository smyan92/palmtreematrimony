import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = width * 0.05;

type ImageDataType = string | null | ImageSourcePropType; 

interface ImageSliderProps {
  images: ImageDataType[];
  onAddPhoto: () => void;
  maxPhotos?: number;
  maxPhotoSizeMB?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  onAddPhoto,
  maxPhotos = 3,
  maxPhotoSizeMB = 2,
}) => {
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

  const renderUploadPlaceholder = () => (
    <TouchableOpacity
      style={[styles.imageCard, styles.placeholder]}
      onPress={onAddPhoto}
    >
      {/* Icon color tweaked to match image's green */}
      <Ionicons name="cloud-upload-outline" size={36} color="#45A049" />
      
      {/* Upload Photo text is black/default */}
      <Text style={[styles.uploadText, { color: '#000', marginTop: 10 }]}>
        Upload Photo
      </Text>
      
      {/* Max photos text (orange/coral) */}
      <Text style={[styles.limitText, { color: '#FF7F50', fontWeight: 'bold' }]}>
        (Max {maxPhotos} photos)
      </Text>
      
      {/* Max size text (fainter orange/coral) */}
      <Text style={[styles.limitText, { color: '#FF7F50' }]}>
        each photo max {maxPhotoSizeMB} MB
      </Text>
    </TouchableOpacity>
  );

  const renderImageItem = (item: ImageDataType) => {
    if (!item) return null; 

    let source: ImageSourcePropType;

    if (typeof item === 'string') {
        // Remote URL support
        source = { uri: item };
    } else {
        // Local asset require() support
        source = item as ImageSourcePropType; 
    }

    return (
      <View style={styles.imageCardContainer}>
      <View>
        <Image
          source={source} 
          style={styles.imageCard}
          resizeMode="cover"
        />
      </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="start"
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item, index }) => {
          if (index === 0 && !item) {
            return renderUploadPlaceholder();
          }
          return renderImageItem(item);
        }}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
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
    },
    imageCard: {
     width: 150,
        height: 200,
        borderRadius: 16,
    },
    placeholder: {
      width: 150,
        height: 200,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF7F50', // Orange border color
        borderStyle: 'dashed', // Dashed border style
        padding: 20, // Add padding to keep content away from the border
    },
    uploadText: {
        // Color is overridden in renderUploadPlaceholder to be black/default
        marginTop: 8,
        fontWeight: '600',
        fontSize: 16,
    },
    limitText: {
        // Color is controlled in renderUploadPlaceholder
        fontSize: 12,
        marginTop: 4,
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
});