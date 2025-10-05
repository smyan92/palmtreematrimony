import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Option {
  label: string;
  value: string;
}

interface DropdownModalProps {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  options: Option[];
  error?: string;
  touched?: boolean;
}

const { height } = Dimensions.get("window");

const DropdownModal: React.FC<DropdownModalProps> = ({
  label,
  value,
  onValueChange,
  options,
  error,
  touched,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onValueChange(val);
    setModalVisible(false);
    setSearchText("");
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text>{value ? options.find(o => o.value === value)?.label : "Select..."}</Text>
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

          {/* Options List */}
          <FlatList
            style={{ maxHeight: height - 180 }}
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={value === item.value ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={value === item.value ? "#007bff" : "#999"}
                />
                <Text style={{ marginLeft: 12 }}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {touched && error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default DropdownModal;

const styles = StyleSheet.create({
  label: { fontWeight: "600", marginBottom: 6 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  error: { color: "#dc3545", fontSize: 12, marginTop: 4 },
});
