import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, TextInputProps } from 'react-native';

interface FormTextInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  error?: string;
  touched?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number; // ✅ optional prop for better control if multiline
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Text Input */}
      <TextInput
        style={[
          styles.input,
          multiline && { textAlignVertical: 'top', height: numberOfLines * 24 + 20 }, // ✅ Better UX for text area
          touched && error && styles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#a0a0a0"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />

      {/* Validation Error */}
      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  error: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
