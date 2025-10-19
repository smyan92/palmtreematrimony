import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ImageSliderProps {
  images?: (string | number | null)[]; // optional
  onAddPhoto: () => void;
}


const ImageSlider: React.FC<ImageSliderProps> = ({ images = [], onAddPhoto }) => {
  return (
    <View style={styles.container}>
     {images?.map((img, index) => (
        <View key={index} style={styles.imageWrapper}>
          {img ? (
            <Image
              source={typeof img === 'string' ? { uri: img } : img}
              style={styles.image}
            />
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={onAddPhoto}>
              <Text style={styles.plus}>+</Text>
              <Text style={styles.label}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  imageWrapper: { margin: 5 },
  image: { width: 100, height: 100, borderRadius: 8 },
  uploadBox: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: { fontSize: 24, fontWeight: 'bold', color: '#888' },
  label: { fontSize: 12, color: '#555', marginTop: 4 },
});

export default ImageSlider;
