// components/FormComponents/TimePickerInput.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface TimePickerInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  touched?: boolean;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({ label, value, onChange, error, touched }) => {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text>{value ? value.toLocaleTimeString() : "Select Time"}</Text>
        <Ionicons name="time-outline" size={20} />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="time"
          display="default"
          onChange={(e, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default TimePickerInput;

const styles = StyleSheet.create({
  label: { fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  error: { color: "#dc3545", fontSize: 12, marginTop: 4 },
});
