import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextInput from "@/components/Forms/TextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://your-api-url.com"; // 🔹 Replace with your backend URL

// Initial form values
const initialValues = {
  mobile: "",
  alternativeNumber: "",
};

// Yup validation schema
const validationSchema = Yup.object({
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number")
    .required("Mobile number is required"),
  alternativeNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number")
    .notOneOf([Yup.ref("mobile")], "Alternative number must be different"),
});

export default function ContactDetailsForm({ userId }: { userId: string }) {
  const handleSave = async (values: typeof initialValues) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in");
        return;
      }

      const response = await fetch(`${API_URL}/user/${userId}/update-contact`, {
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

      Alert.alert("Success", "Contact details updated successfully!");
      console.log("Updated Contact Details:", data.user);
    } catch (error: any) {
      console.error("Save Error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
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
                style={[styles.button, (!isValid || !dirty) && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={!isValid || !dirty}
              >
                <Text style={styles.buttonText}>Save</Text>
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
