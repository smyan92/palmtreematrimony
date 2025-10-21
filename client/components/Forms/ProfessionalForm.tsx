import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FormTextInput from "@/components/Forms/TextInput";
import Dropdown from "@/components/Forms/Dropdown";

const API_URL = "http://192.168.43.38:5000";

// ✅ Initial empty values
const initialValues = {
  higherEducation: "",
  jobTitle: "",
  monthlySalary: "",
  jobTown: "",
};

// ✅ Validation Schema
const validationSchema = Yup.object({
  higherEducation: Yup.string().required("Higher Education is required"),
  jobTitle: Yup.string().required("Job Title is required"),
  monthlySalary: Yup.number()
    .typeError("Monthly Salary must be a number")
    .min(0, "Salary cannot be negative")
    .required("Monthly Salary is required"),
  jobTown: Yup.string().required("Job Town is required"),
});

// ✅ Dropdown Options
const higherEducationOptions = [
  { label: "Ph.D. / Doctoral Degree", value: "PhD" },
  { label: "M.Tech (Master of Technology)", value: "MTech" },
  { label: "M.E. (Master of Engineering)", value: "ME" },
  { label: "M.C.A. (Master of Computer Applications)", value: "MCA" },
  { label: "M.Sc. (Master of Science)", value: "MSc" },
  { label: "M.A. (Master of Arts)", value: "MA" },
  { label: "M.Com (Master of Commerce)", value: "MCom" },
  { label: "B.Tech (Bachelor of Technology)", value: "BTech" },
  { label: "B.E. (Bachelor of Engineering)", value: "BE" },
  { label: "B.Sc. (Bachelor of Science)", value: "BSc" },
  { label: "B.A. (Bachelor of Arts)", value: "BA" },
  { label: "B.Com (Bachelor of Commerce)", value: "BCom" },
  { label: "MBBS / BDS / BAMS (Medical)", value: "Medical" },
  { label: "CA / CS / ICWA (Finance/Accounting)", value: "Finance" },
  { label: "Other Graduate Degree", value: "OtherGrad" },
  { label: "Diploma / ITI", value: "Diploma/ITI" },
  { label: "High School / School Level", value: "HighSchool" },
];

const jobTitleOptions = [
  { label: "Software Engineer", value: "Software Engineer" },
  { label: "Web Developer", value: "Web Developer" },
  { label: "Mobile App Developer", value: "Mobile App Developer" },
  { label: "Teacher", value: "Teacher" },
  { label: "Doctor", value: "Doctor" },
  { label: "Entrepreneur", value: "Entrepreneur" },
  { label: "Business Owner", value: "Business Owner" },
  { label: "Government Employee", value: "Government Employee" },
  { label: "Other", value: "Other" },
];

const jobTownOptions = [
  { label: "Chennai", value: "Chennai" },
  { label: "Coimbatore", value: "Coimbatore" },
  { label: "Madurai", value: "Madurai" },
  { label: "Trichy", value: "Trichy" },
  { label: "Salem", value: "Salem" },
  { label: "Bengaluru", value: "Bengaluru" },
  { label: "Hyderabad", value: "Hyderabad" },
  { label: "Mumbai", value: "Mumbai" },
  { label: "Delhi", value: "Delhi" },
];

export default function JobEducationForm() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<typeof initialValues | null>(null);

  // ✅ Fetch existing education/job data
  const fetchEducationDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user?.id) {
        Alert.alert("Error", "User not found. Please login first.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/user/${user.id}/education`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      const userEdu = data.educationDetails || {};

      setInitialData({
        higherEducation: userEdu.higherEducation || "",
        jobTitle: userEdu.jobTitle || "",
        monthlySalary: userEdu.monthlySalary?.toString() || "",
        jobTown: userEdu.jobTown || "",
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save updated education/job data
  const handleRegistration = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!token || !user?.id) {
        Alert.alert("Error", "No user or token found. Please log in first.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/user/${user.id}/education`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to save Education & Job data");
        return;
      }

      Alert.alert("Success", "Education & Job details saved successfully!");
    } catch (err) {
      console.error("Error updating job/education:", err);
      Alert.alert("Error", "Something went wrong (Server or Network Error)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationDetails();
  }, []);

  if (loading || !initialData) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007bff" />
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
          onSubmit={(values) => handleRegistration(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isValid, dirty }) => (
            <View>
              <Dropdown
                label="Higher Education"
                value={values.higherEducation}
                onValueChange={(val) => setFieldValue("higherEducation", val)}
                options={higherEducationOptions}
                error={errors.higherEducation}
                touched={touched.higherEducation}
              />

              <Dropdown
                label="Job Title"
                value={values.jobTitle}
                onValueChange={(val) => setFieldValue("jobTitle", val)}
                options={jobTitleOptions}
                error={errors.jobTitle}
                touched={touched.jobTitle}
              />

              <FormTextInput
                label="Monthly Salary"
                value={values.monthlySalary}
                onChangeText={handleChange("monthlySalary")}
                onBlur={handleBlur("monthlySalary")}
                error={errors.monthlySalary}
                touched={touched.monthlySalary}
                keyboardType="numeric"
              />

              <Dropdown
                label="Job Town"
                value={values.jobTown}
                onValueChange={(val) => setFieldValue("jobTown", val)}
                options={jobTownOptions}
                error={errors.jobTown}
                touched={touched.jobTown}
              />

              <TouchableOpacity
                style={[styles.button, (!isValid || !dirty || loading) && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={!isValid || !dirty || loading}
              >
                <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a0c8f5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
