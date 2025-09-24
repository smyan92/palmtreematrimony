import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo vector icons

interface FindProfile {
  onGoPress: (searchText: string) => void; // Function to call when 'Go' is pressed
  placeholder?: string; // Optional placeholder text for the input
}

export default function SearchInputWithGo({ onGoPress, placeholder = "Enter Id" }: SearchInputWithGoProps) {
  const [searchText, setSearchText] = useState('');

  const handleGoPress = () => {
    onGoPress(searchText);
    // Optionally clear the input after pressing Go
    // setSearchText(''); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="go" // Changes the keyboard return key to "Go"
          onSubmitEditing={handleGoPress} // Triggers 'Go' press when keyboard 'Go' is pressed
        />
      </View>
      <Pressable style={styles.goButton} onPress={handleGoPress}>
        <Text style={styles.goButtonText}>Go</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16, // Adjust padding as needed for your layout
    paddingVertical: 10,
    backgroundColor: '#fff', // Or match your screen's background
  },
  inputContainer: {
    flex: 1, // Takes up remaining space
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10, // Rounded corners for the input
    paddingHorizontal: 10,
    height: 50, // Fixed height for the input field
    backgroundColor: '#f9f9f9', // Slightly off-white background for input
    marginRight: 10, // Space between input and button
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  goButton: {
    backgroundColor: '#F18221', // Green color
    borderRadius: 10, // Rounded corners for the button
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Match height of the input field
  },
  goButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});