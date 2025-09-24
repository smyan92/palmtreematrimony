import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Consolidated options for the picker and multi-select inputs
const filterOptions = {
  gender: ['Any', 'Male', 'Female'],
  maritalStatus: ['Any', 'No', 'Yes'],
  color: ['Any', 'Fair', 'Wheatish', 'Dark'],
  religion: ['Any', 'Hindu', 'Muslim', 'Christian', 'Other'],
  caste: ['Any', 'Nadar', 'Other Caste 1', 'Other Caste 2'],
  rasi: ['Mesham', 'Rishabam', 'Midhunam', 'Kadam', 'Simmam', 'Kanni', 'Thulam', 'Vrichigam', 'Dhanusu', 'Makaram', 'Kumbam', 'Meenam'],
  natchatiram: ['Bharani', 'Aswini', 'Karthigai', 'Rohini', 'Mirugasirisham', 'Thiruvadhirai'],
  dhosam: ['Any', 'Yes', 'No'],
  job: ['Any', 'Engineer', 'Doctor', 'Teacher', 'Business', 'Other'],
  nagaiYethiparpu: ['Any', '5 Sovereign', '10 Sovereign', 'No Expectation'],
  eating: ['Any', 'Veg', 'Non-Veg'],
  smoking: ['Any', 'No', 'Yes'],
  drinks: ['Any', 'No', 'Yes'],
  houseType: ['Any', 'Owned', 'Rented', 'Joint Family'],
  cities: ['Madurai', 'Chennai', 'Bangalore', 'Coimbatore', 'Mumbai', 'Delhi'],
};

// This list defines the order, labels, and type of the fields
const filterFields = [
  { key: 'gender', label: 'Gender' },
  { key: 'maritalStatus', label: 'Marital Status' },
  { key: 'ageRange', label: 'Age Range', type: 'range' },
  { key: 'color', label: 'Skin Color' },
  { key: 'religion', label: 'Religion' },
  { key: 'caste', label: 'Caste' },
  { key: 'rasi', label: 'Rasi', type: 'multi-select' },
  { key: 'natchatiram', label: 'Natchatiram (Stars)', type: 'multi-select' },
  { key: 'dhosam', label: 'Dhosam' },
  { key: 'job', label: 'Job' },
  { key: 'monthlySalary', label: 'Monthly Salary', type: 'range' },
  { key: 'houseType', label: 'House Type' },
  { key: 'eating', label: 'Eating Habits' },
  { key: 'smoking', label: 'Smoking' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'nagaiYethiparpu', label: 'Nagai Expectation' },
  { key: 'cities', label: 'Select Cities', type: 'multi-select' },
];

const FilterComponent = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    gender: 'Any',
    maritalStatus: 'Any',
    ageMin: '',
    ageMax: '',
    color: 'Any',
    religion: 'Any',
    caste: 'Any',
    rasi: [],
    natchatiram: [],
    dhosam: 'Any',
    job: 'Any',
    monthlySalaryMin: '',
    monthlySalaryMax: '',
    houseType: 'Any',
    eating: 'Any',
    smoking: 'Any',
    drinks: 'Any',
    nagaiYethiparpu: 'Any',
    cities: [],
  });

  const handleSingleSelectChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleMultiSelectChange = (key, value) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[key];
      if (currentValues.includes(value)) {
        return { ...prevFilters, [key]: currentValues.filter((item) => item !== value) };
      } else {
        return { ...prevFilters, [key]: [...currentValues, value] };
      }
    });
  };

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      ageMin: filters.ageMin ? parseInt(filters.ageMin, 10) : null,
      ageMax: filters.ageMax ? parseInt(filters.ageMax, 10) : null,
      monthlySalaryMin: filters.monthlySalaryMin ? parseInt(filters.monthlySalaryMin, 10) : null,
      monthlySalaryMax: filters.monthlySalaryMax ? parseInt(filters.monthlySalaryMax, 10) : null,
    };
    onSearch(searchFilters);
    console.log('Searching with filters:', searchFilters);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter by Details</Text>

          {filterFields.map((field) => {
            // Renders input for age and salary range
            if (field.type === 'range') {
              return (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <View style={styles.rangeInputRow}>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="Min"
                      value={filters[`${field.key}Min`]}
                      onChangeText={(value) => handleSingleSelectChange(`${field.key}Min`, value)}
                    />
                    <Text style={styles.rangeSeparator}>-</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="Max"
                      value={filters[`${field.key}Max`]}
                      onChangeText={(value) => handleSingleSelectChange(`${field.key}Max`, value)}
                    />
                  </View>
                </View>
              );
            // Renders buttons for multi-select options
            } else if (field.type === 'multi-select') {
              const selectedValues = filters[field.key];
              return (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.multiSelectContainer}>
                      {filterOptions[field.key].map((option) => {
                        const isSelected = selectedValues.includes(option);
                        return (
                          <TouchableOpacity
                            key={option}
                            style={[styles.multiSelectButton, isSelected && styles.selectedButton]}
                            onPress={() => handleMultiSelectChange(field.key, option)}
                          >
                            <Text style={[styles.multiSelectText, isSelected && styles.selectedText]}>
                              {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              );
            // Renders Picker for single-select options
            } else {
              return (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <Picker
                    selectedValue={filters[field.key]}
                    onValueChange={(value) => handleSingleSelectChange(field.key, value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {filterOptions[field.key].map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              );
            }
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Filter & Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  pickerItem: {
    fontSize: 14,
    height: 50,
  },
  textInput: {
    flex: 1, // Needed for range inputs
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  rangeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeSeparator: {
    fontSize: 16,
    color: '#555',
    marginHorizontal: 10,
  },
  // Multi-select styles
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingTop: 5,
  },
  multiSelectButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  selectedButton: {
    backgroundColor: '#FFB634',
    borderColor: '#FFB634',
  },
  multiSelectText: {
    color: '#444',
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Search button
  searchButton: {
    backgroundColor: '#FFB634',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilterComponent;