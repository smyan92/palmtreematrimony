import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

interface ChipMultiSelectProps {
  label: string;
  name: string;
  formik: any;
  items: { label: string; value: string }[];
  min?: number;
  max?: number;
}

const ChipMultiSelect: React.FC<ChipMultiSelectProps> = ({
  label,
  name,
  formik,
  items,
  min = 1,
  max = 5,
}) => {
  const value: string[] = formik.values[name] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* ✅ Selected tags shown ABOVE dropdown */}
      <View style={styles.tagContainer}>
        {value.map((val) => {
          const item = items.find((i) => i.value === val);
          if (!item) return null;
          return (
            <View key={val} style={styles.tag}>
              <Text style={styles.tagText}>{item.label}</Text>
              <TouchableOpacity
                onPress={() =>
                  formik.setFieldValue(
                    name,
                    value.filter((v) => v !== val)
                  )
                }
              >
                <Text style={styles.tagRemove}> ✕ </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* ✅ Dropdown below tags */}
     <MultiSelect
  style={styles.dropdown}
  placeholderStyle={styles.placeholder}
  selectedTextStyle={styles.selectedText}
  inputSearchStyle={styles.searchInput}
  data={items}
  labelField="label"
  valueField="value"
  placeholder={`Select ${label}`}
  search
  value={value}
  maxSelect={max}
  onChange={(selected: string[]) => {
    if (min && selected.length < min) return;
    formik.setFieldValue(name, selected);
  }}
  renderSelectedItem={() => <></>}   // ✅ fixes error, hides bottom tags
/>


      {formik.touched[name] && formik.errors[name] && (
        <Text style={styles.error}>{formik.errors[name]}</Text>
      )}
    </View>
  );
};

export default ChipMultiSelect;

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  label: { fontWeight: "bold", marginBottom: 6 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  placeholder: { color: "#999" },
  selectedText: { color: "#000" },
  searchInput: { height: 40, fontSize: 14 },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f0ff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 4,
  },
  tagText: { marginRight: 6, color: "#333" },
  tagRemove: { color: "red", fontWeight: "bold" },
  error: { color: "red", fontSize: 12, marginTop: 4 },
});
