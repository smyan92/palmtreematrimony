import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";

interface MultiSelectDropdownProps {
  label: string;
  name: string;
  formik: any; // values, setFieldValue, touched, errors
  items: ItemType<string>[];
  zIndex?: number;
  min?: number;
  max?: number;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  name,
  formik,
  items,
  zIndex = 10,
  min = 1,
  max = 5,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<ItemType<string>[]>(items);

  const value = formik.values[name] || [];

  return (
    <View
      style={[
        styles.container,
        { zIndex: Platform.OS === "ios" ? zIndex : undefined, elevation: Platform.OS === "android" ? zIndex : undefined },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={dropdownItems}
        setOpen={setOpen}
        setItems={setDropdownItems}
        setValue={(callback) => {
          const val = typeof callback === "function" ? callback(value) : callback;
          formik.setFieldValue(name, val);
        }}
        multiple={true}
        min={min}
        max={max}
        placeholder={`Select ${label}`}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownMenu}
      />
      {formik.touched[name] && formik.errors[name] && (
        <Text style={styles.error}>{formik.errors[name]}</Text>
      )}
    </View>
  );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontWeight: "bold", marginBottom: 4 },
  dropdown: { borderColor: "#ccc" },
  dropdownMenu: { borderColor: "#ccc" },
  error: { color: "red", fontSize: 12, marginTop: 4 },
});
