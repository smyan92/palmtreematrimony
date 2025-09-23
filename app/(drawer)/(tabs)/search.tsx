// app/search.tsx
import React from 'react';
import { View, Text } from 'react-native';
import FilterComponent from '@/components/Filter'; // Adjust the path
import { Stack } from 'expo-router';

export default function SearchScreen() {
  const handleSearchResults = (filters) => {
    // This is where you would call your API or filter your local data
    // based on the `filters` object
    console.log('Filters received:', filters);
    // e.g., perform a search: api.searchProfiles(filters);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Search' }} />
      <FilterComponent onSearch={handleSearchResults} />
    </View>
  );
}