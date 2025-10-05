import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  label: string;
  value: string;
}

interface MultiDropdownModalProps {
  label: string;
  selectedValues: string[];   // ✅ you called it "selectedValues"
  onValuesChange: (vals: string[]) => void;
  options: Option[];
  error?: string | string[];
  touched?: boolean;
}


const { height } = Dimensions.get('window');

const MultiDropdownModal: React.FC<MultiDropdownModalProps> = ({
  label,
  selectedValues,
  onValuesChange,
  options,
  error,
  touched
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>([...selectedValues]);

  const toggleValue = (val: string) => {
    if (tempSelected.includes(val)) {
      setTempSelected(tempSelected.filter(v => v !== val));
    } else {
      setTempSelected([...tempSelected, val]);
    }
  };

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDone = () => {
    onValuesChange(tempSelected);
    setModalVisible(false);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text>{selectedValues.length ? `${selectedValues.length} selected` : 'Select...'}</Text>
        <Ionicons name="chevron-down-outline" size={20} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Top: Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          </View>

          {/* Middle: Options List */}
          <FlatList
            style={{ maxHeight: height - 180 }}
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isChecked = tempSelected.includes(item.value);
              return (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => toggleValue(item.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={isChecked ? '#007bff' : '#999'}
                  />
                  <Text style={{ marginLeft: 12 }}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Bottom: Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

    {touched && error && (
  <Text style={styles.error}>
    {Array.isArray(error) ? error.join( ', ') : error}
  </Text>
)}


    </View>
  );
};

export default MultiDropdownModal;

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 6 },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  doneButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  doneText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: { color: '#dc3545', fontSize: 12, marginTop: 4 },
});
