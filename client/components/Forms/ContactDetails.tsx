import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextInput from "@/components/Forms/TextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.43.38:5000";

// Initial form values (used as default and type definition)
const initialValues = {
  mobile: "",
  alternativeNumber: "",
};
type ContactDetails = typeof initialValues;

// Yup validation schema
const validationSchema = Yup.object({
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number")
    .required("Mobile number is required"),
  alternativeNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number")
    .notOneOf([Yup.ref("mobile")], "Alternative number must be different"),
});

export default function ContactDetailsForm() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<ContactDetails>(initialValues);

  // --- Data Fetching Logic ---
  const fetchContactDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/user/${userId}/contact`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      const contact = data.contactDetails || {};

      // Set the initial data state, ensuring empty strings for missing values
      setInitialData({
        mobile: contact.mobile || "",
        alternativeNumber: contact.alternativeNumber || "",
      });
    } catch (err) {
      console.error("Fetch Contact Details Error:", err);
      Alert.alert("Error", "Failed to load contact details");
      // Fallback: Use initial empty values
      setInitialData(initialValues);
    } finally {
      setLoading(false);
    }
  };
  // --- End Fetching Logic ---

  // --- Saving Logic ---
  const handleSave = async (values: ContactDetails) => {
    try {
      setLoading(true); // Set loading while saving
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      if (!token || !userId) {
        Alert.alert("Error", "Authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/user/${userId}/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to update contact details");
        return;
      }

      // 🎯 IMPROVEMENT: Re-fetch the data to reset the Formik state (dirty: false)
      await fetchContactDetails(); 

      Alert.alert("Success", "Contact details updated successfully!");
      console.log("Updated Contact Details:", data.user);
    } catch (error: any) {
      console.error("Save Error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // --- End Saving Logic ---


  useEffect(() => {
    fetchContactDetails();
  }, []);

  // Display loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 8 }}>Loading Contact Details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          // 🎯 KEY FIX: Use initialData state and enableReinitialize
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          enableReinitialize // Tells Formik to update when initialData changes
          validateOnChange
          validateOnBlur
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            dirty,
          }) => (
            <View>
              {/* Mobile Number */}
              <FormTextInput
                label="Mobile Number"
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                value={values.mobile}
                onChangeText={handleChange("mobile")}
                onBlur={handleBlur("mobile")}
                error={errors.mobile}
                touched={touched.mobile}
              />

              {/* Alternative Number */}
              <FormTextInput
                label="Alternative Number"
                placeholder="Enter alternative number"
                keyboardType="phone-pad"
                value={values.alternativeNumber}
                onChangeText={handleChange("alternativeNumber")}
                onBlur={handleBlur("alternativeNumber")}
                error={errors.alternativeNumber}
                touched={touched.alternativeNumber}
              />

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  (!isValid || !dirty || loading) && styles.buttonDisabled, // Disable while saving
                ]}
                onPress={() => handleSubmit()}
                disabled={!isValid || !dirty || loading}
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
});