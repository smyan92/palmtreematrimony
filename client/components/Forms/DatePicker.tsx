import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  touched?: boolean;
  maximumDate?: Date; // Optional, useful for DOB
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChange,
  error,
  touched,
  maximumDate,
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios'); // keep open on iOS
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, touched && error && styles.inputError]}
        onPress={() => setShow(true)}
      >
        <Text style={{ color: value ? '#000' : '#a0a0a0' }}>
          {value ? value.toDateString() : 'Select Date'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#333" />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date(2000, 0, 1)}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate || new Date()}
        />
      )}

      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  inputError: { borderColor: '#dc3545' },
  error: { color: '#dc3545', fontSize: 12, marginTop: 4 },
});
