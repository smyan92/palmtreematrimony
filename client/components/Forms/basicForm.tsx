import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextInput from "@/components/Forms/TextInput";
import DatePickerInput from "@/components/Forms/DatePicker";
import Dropdown from "@/components/Forms/Dropdown";

const initialValues = {
  fullName: "",
  dob: null,
  homeTown: "",
  religion: "",
  subCaste: "",
  rasi: "",
  star: "",
  skinColor: "",
  height: "",
  weight: "",
  foodHabit: "",
  motherTongue: "",
  chevaiDosham: "",
  goldWeight: "",
  physicalChallenge: "",
};

const validationSchema = Yup.object({
  fullName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .required("Full Name is required"),
  dob: Yup.date()
    .transform((value, originalValue) =>
      originalValue ? new Date(originalValue) : null
    )
    .max(new Date(), "Date of Birth cannot be in the future")
    .required("Date of Birth is required"),
  homeTown: Yup.string().min(2, "Please enter a valid hometown").required(),
  religion: Yup.string().required("Religion is required"),
  subCaste: Yup.string().min(2).required("Subcaste is required"),
  rasi: Yup.string().required("Rasi is required"),
  star: Yup.string().required("Star is required"),
  skinColor: Yup.string().required("Skin color is required"),
  height: Yup.string()
    .matches(/^[0-9]+(\.[0-9]+)?$/, "Height must be a number")
    .test(
      "height-range",
      "Height must be between 100 cm and 220 cm",
      (val) => {
        const num = Number(val);
        return num >= 100 && num <= 220;
      }
    )
    .required("Height is required"),
  weight: Yup.string()
    .matches(/^[0-9]+$/, "Weight must be digits only")
    .test("weight-range", "Weight must be between 30kg and 180kg", (val) => {
      const num = Number(val);
      return num >= 30 && num <= 180;
    })
    .required("Weight is required"),
  foodHabit: Yup.string().required("Food habit is required"),
  motherTongue: Yup.string().required("Mother tongue is required"),
  chevaiDosham: Yup.string()
    .oneOf(["yes", "no", "unknown"])
    .required("Chevai dosham is required"),
  goldWeight: Yup.string()
    .matches(/^[0-9]+(\.[0-9]+)?$/, "Enter valid gold weight (in grams)")
    .test("gold-range", "Gold weight must be between 0g and 1000g", (val) => {
      const num = Number(val);
      return num >= 0 && num <= 1000;
    })
    .required("Gold weight is required"),
  physicalChallenge: Yup.string()
    .oneOf(["yes", "no", "partial"])
    .required("Physical challenge status is required"),
});

// Dropdown options
const homeTownOptions = [
  { label: "Madurai", value: "madurai" },
  { label: "Chennai", value: "chennai" },
  { label: "Coimbatore", value: "coimbatore" },
];
const religionOptions = [
  { label: "Hindu", value: "hindu" },
  { label: "Christian", value: "christian" },
  { label: "Muslim", value: "muslim" },
  { label: "Sikh", value: "sikh" },
  { label: "Other", value: "other" },
];
const subCasteOptions = [
  { label: "Iyer", value: "iyer" },
  { label: "Iyengar", value: "iyengar" },
];
const rasiOptions = [
  { label: "Mesh", value: "mesh" },
  { label: "Rishab", value: "rishab" },
];
const starOptions = [
  { label: "Ashwini", value: "ashwini" },
  { label: "Bharani", value: "bharani" },
];
const skinColorOptions = [
  { label: "Fair", value: "fair" },
  { label: "Wheatish", value: "wheatish" },
  { label: "Dark", value: "dark" },
];
const heightOptions = [
  { label: "4.5 ft", value: "135" },
  { label: "5 ft", value: "150" },
  { label: "5.5 ft", value: "165" },
];
const foodHabitOptions = [
  { label: "Vegetarian", value: "veg" },
  { label: "Non-Vegetarian", value: "nonveg" },
  { label: "Eggetarian", value: "egg" },
];
const motherTongueOptions = [
  { label: "Tamil", value: "tamil" },
  { label: "Telugu", value: "telugu" },
  { label: "Malayalam", value: "malayalam" },
  { label: "Kannada", value: "kannada" },
];
const chevaiDoshamOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Don’t Know", value: "unknown" },
];
const physicalChallengeOptions = [
  { label: "No", value: "no" },
  { label: "Yes", value: "yes" },
  { label: "Partially", value: "partial" },
];

export default function App() {
  const handleRegistration = (values: typeof initialValues) => {
    Alert.alert("Success", "Form submitted successfully!");
    console.log("Form Submitted:", values);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegistration}
          validateOnChange={true}
          validateOnBlur={true}
          validateOnMount={true}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            setFieldValue,
          }) => (
            <View>
              {/* Full Name */}
              <FormTextInput
                label="Full Name"
                placeholder="Enter your name"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={errors.fullName}
                touched={touched.fullName}
              />

              {/* DOB */}
              <DatePickerInput
                label="Date of Birth"
                value={values.dob}
                onChange={(date) => setFieldValue("dob", date)}
                error={errors.dob}
                touched={touched.dob}
                maximumDate={new Date()}
              />

              {/* Dropdowns */}
              <Dropdown
                label="Home Town"
                value={values.homeTown}
                onValueChange={(val) => setFieldValue("homeTown", val)}
                options={homeTownOptions}
                error={errors.homeTown}
                touched={touched.homeTown}
              />

              <Dropdown
                label="Religion"
                value={values.religion}
                onValueChange={(val) => setFieldValue("religion", val)}
                options={religionOptions}
                error={errors.religion}
                touched={touched.religion}
              />

              <Dropdown
                label="Subcaste"
                value={values.subCaste}
                onValueChange={(val) => setFieldValue("subCaste", val)}
                options={subCasteOptions}
                error={errors.subCaste}
                touched={touched.subCaste}
              />

              <Dropdown
                label="Rasi"
                value={values.rasi}
                onValueChange={(val) => setFieldValue("rasi", val)}
                options={rasiOptions}
                error={errors.rasi}
                touched={touched.rasi}
              />

              <Dropdown
                label="Star"
                value={values.star}
                onValueChange={(val) => setFieldValue("star", val)}
                options={starOptions}
                error={errors.star}
                touched={touched.star}
              />

              <Dropdown
                label="Skin Color"
                value={values.skinColor}
                onValueChange={(val) => setFieldValue("skinColor", val)}
                options={skinColorOptions}
                error={errors.skinColor}
                touched={touched.skinColor}
              />

              <Dropdown
                label="Height (cm)"
                value={values.height}
                onValueChange={(val) => setFieldValue("height", val)}
                options={heightOptions}
                error={errors.height}
                touched={touched.height}
              />

              <FormTextInput
                label="Weight (kg)"
                placeholder="Enter your weight"
                value={values.weight}
                onChangeText={handleChange("weight")}
                onBlur={handleBlur("weight")}
                error={errors.weight}
                touched={touched.weight}
              />

              <Dropdown
                label="Food Habit"
                value={values.foodHabit}
                onValueChange={(val) => setFieldValue("foodHabit", val)}
                options={foodHabitOptions}
                error={errors.foodHabit}
                touched={touched.foodHabit}
              />

              <Dropdown
                label="Mother Tongue"
                value={values.motherTongue}
                onValueChange={(val) => setFieldValue("motherTongue", val)}
                options={motherTongueOptions}
                error={errors.motherTongue}
                touched={touched.motherTongue}
              />

              <Dropdown
                label="Chevai Dosham"
                value={values.chevaiDosham}
                onValueChange={(val) => setFieldValue("chevaiDosham", val)}
                options={chevaiDoshamOptions}
                error={errors.chevaiDosham}
                touched={touched.chevaiDosham}
              />

              <FormTextInput
                label="Gold Weight (in Pown)"
                placeholder="Enter gold weight"
                value={values.goldWeight}
                onChangeText={handleChange("goldWeight")}
                onBlur={handleBlur("goldWeight")}
                error={errors.goldWeight}
                touched={touched.goldWeight}
              />

              <Dropdown
                label="Physical Challenge"
                value={values.physicalChallenge}
                onValueChange={(val) =>
                  setFieldValue("physicalChallenge", val)
                }
                options={physicalChallengeOptions}
                error={errors.physicalChallenge}
                touched={touched.physicalChallenge}
              />

              {/* Fill Test Data Button */}
              <TouchableOpacity
                style={styles.fillButton}
                onPress={() => {
                  setFieldValue("fullName", "John Doe");
                  setFieldValue("dob", new Date("1990-01-01"));
                  setFieldValue("homeTown", "madurai");
                  setFieldValue("religion", "hindu");
                  setFieldValue("subCaste", "iyer");
                  setFieldValue("rasi", "mesh");
                  setFieldValue("star", "ashwini");
                  setFieldValue("skinColor", "fair");
                  setFieldValue("height", "165");
                  setFieldValue("weight", "70");
                  setFieldValue("foodHabit", "veg");
                  setFieldValue("motherTongue", "tamil");
                  setFieldValue("chevaiDosham", "no");
                  setFieldValue("goldWeight", "100");
                  setFieldValue("physicalChallenge", "no");
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Fill Test Data
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
        <TouchableOpacity
  style={[styles.button, !isValid && styles.buttonDisabled]}
  onPress={() => handleSubmit()} // ✅ wrap in arrow function
  disabled={!isValid}
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
  fillButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
});
