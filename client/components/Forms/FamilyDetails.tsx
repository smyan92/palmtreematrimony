import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormTextInput from "@/components/Forms/TextInput";
import Dropdown from "@/components/Forms/Dropdown";

const API_URL = "http://192.168.43.38:5000";

// Default form values
const initialValues = {
  homeType: "",
  hasLoan: false,
  hasCar: false,
  propertyDetails: "",
  drinkingHabit: "",
};

// Validation schema
const validationSchema = Yup.object({
  homeType: Yup.string().required("Home type is required"),
  hasLoan: Yup.boolean(),
  hasCar: Yup.boolean(),
  propertyDetails: Yup.string()
    .max(300, "Maximum 300 characters allowed")
    .nullable(),
  drinkingHabit: Yup.string().required("Drinking habit is required"),
});

// Dropdown options
const homeTypeOptions = [
  { label: "Own House", value: "own" },
  { label: "Rented House", value: "rented" },
  { label: "Living with Family", value: "family" },
];

// ✅ AFTER (Corrected values: "Never", "Occasionally", "Regularly")
const drinkingHabitOptions = [
  { label: "Never", value: "Never" },
  { label: "Occasionally", value: "Occasionally" },
  { label: "Regularly", value: "Regularly" },
];

export default function FamilyDetailsForm() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(initialValues);

  // Fetch family details
  const fetchFamilyDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user?.id) return;

      const res = await fetch(`${API_URL}/user/${user.id}/family`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      const family = data.familyDetails || {};

      // Map API response to form values
      setInitialData({
        homeType: family.homeType || "",
        hasLoan: family.hasLoan ?? false,
        hasCar: family.hasCar ?? false,
        propertyDetails: family.propertyDetails || "",
        drinkingHabit:
          family.drinkingHabit && family.drinkingHabit !== "Not Specified"
            ? family.drinkingHabit
            : "",
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load family details");
    } finally {
      setLoading(false);
    }
  };

  // Save family details
  const handleRegistration = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!token || !user?.id) {
        Alert.alert("Error", "No user or token found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/user/${user.id}/family`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed to save family details");
        return;
      }

      Alert.alert("Success", "Family details saved successfully!");
      console.log("Saved family details:", values);
    } catch (error) {
      console.error("Error saving family details:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 8 }}>Loading Family Details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          enableReinitialize
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleRegistration}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <View>
              <Dropdown
                label="Home Type"
                value={values.homeType}
                onValueChange={(val) => setFieldValue("homeType", val)}
                options={homeTypeOptions}
                error={errors.homeType}
                touched={touched.homeType}
              />

              <View style={styles.switchRow}>
                <Text style={styles.label}>Do you have a loan?</Text>
             <Switch
    value={values.hasLoan}
    onValueChange={(val: boolean) => void setFieldValue("hasLoan", val)}
  />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.label}>Do you have a car?</Text>
              <Switch
    value={values.hasCar}
    onValueChange={(val: boolean) => void setFieldValue("hasCar", val)}
  />
              </View>

              <FormTextInput
                label="Property Details"
                placeholder="Enter property details..."
                value={values.propertyDetails}
                onChangeText={handleChange("propertyDetails")}
                onBlur={handleBlur("propertyDetails")}
                multiline
                numberOfLines={3}
                error={errors.propertyDetails}
                touched={touched.propertyDetails}
              />

              <Dropdown
                label="Drinking Habit"
                value={values.drinkingHabit}
                onValueChange={(val) => setFieldValue("drinkingHabit", val)}
                options={drinkingHabitOptions}
                error={errors.drinkingHabit}
                touched={touched.drinkingHabit}
              />

          <TouchableOpacity
  style={[styles.button, !isValid && styles.buttonDisabled]}
  onPress={() => handleSubmit()} // <-- wrap in arrow function
  disabled={!isValid || loading}
>
                <Text style={styles.buttonText}>
                  {loading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fa" },
  container: { flexGrow: 1, padding: 16, justifyContent: "center" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#a0c8f5" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: { fontSize: 16, fontWeight: "500", color: "#333" },
});
