import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  height: Yup.string().required("Height is required"),
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
  { label: "Chennai", value: "Chennai" },
  { label: "Coimbatore", value: "Coimbatore" },
  { label: "Madurai", value: "Madurai" },
  { label: "Tiruchirappalli", value: "Tiruchirappalli" },
  { label: "Salem", value: "Salem" },
  { label: "Ambattur", value: "Ambattur" },
  { label: "Tirunelveli", value: "Tirunelveli" },
  { label: "Tiruppur", value: "Tiruppur" },
  { label: "Avadi", value: "Avadi" },
  { label: "Tiruvottiyur", value: "Tiruvottiyur" },
  { label: "Thoothukkudi", value: "Thoothukkudi" },
  { label: "Nagercoil", value: "Nagercoil" },
  { label: "Thanjavur", value: "Thanjavur" },
  { label: "Pallavaram", value: "Pallavaram" },
  { label: "Dindigul", value: "Dindigul" },
  { label: "Vellore", value: "Vellore" },
  { label: "Tambaram", value: "Tambaram" },
  { label: "Cuddalore", value: "Cuddalore" },
  { label: "Kancheepuram", value: "Kancheepuram" },
  { label: "Alandur", value: "Alandur" },
  { label: "Erode", value: "Erode" },
  { label: "Tiruvannamalai", value: "Tiruvannamalai" },
  { label: "Kumbakonam", value: "Kumbakonam" },
  { label: "Rajapalayam", value: "Rajapalayam" },
  { label: "Kurichi", value: "Kurichi" },
  { label: "Madavaram", value: "Madavaram" },
  { label: "Pudukkottai", value: "Pudukkottai" },
  { label: "Hosur", value: "Hosur" },
  { label: "Ambur", value: "Ambur" },
  { label: "Karaikkudi", value: "Karaikkudi" },
  { label: "Neyveli", value: "Neyveli" },
  { label: "Nagapattinam", value: "Nagapattinam" },
  { label: "Bengaluru", value: "Bengaluru" },
  { label: "Hyderabad", value: "Hyderabad" },
  { label: "Mumbai", value: "Mumbai" },
  { label: "Delhi", value: "Delhi" },
  { label: "Kolkata", value: "Kolkata" },
  { label: "Pune", value: "Pune" },
  { label: "Jaipur", value: "Jaipur" },
  { label: "Lucknow", value: "Lucknow" },
  { label: "Nagpur", value: "Nagpur" },
  { label: "Visakhapatnam", value: "Visakhapatnam" },
  { label: "Bhubaneswar", value: "Bhubaneswar" },
  { label: "Chandigarh", value: "Chandigarh" },
  { label: "Gurugram", value: "Gurugram" },
  { label: "Noida", value: "Noida" },
  { label: "Kochi", value: "Kochi" },
  { label: "Vijayawada", value: "Vijayawada" },
];
const religionOptions = [
  { label: "Hindu", value: "Hindu" },
  { label: "Christian", value: "Christian" },
  { label: "Muslim", value: "Muslim" },
  { label: "Jain", value: "Jain" },
  { label: "Other", value: "Other" },
];
const subCasteOptions = [
  { label: "Nadar (General)", value: "Nadar" },
  { label: "Gramani Nadar", value: "Gramani Nadar" },
  { label: "Shanar Nadar", value: "Shanar Nadar" },
  { label: "Santror Nadar", value: "Santror Nadar" },
  { label: "Nanjil Nadar", value: "Nanjil Nadar" },
  { label: "Kongu Nadar", value: "Kongu Nadar" },
  { label: "Nattathi Nadar", value: "Nattathi Nadar" },
  { label: "Kovil Nadar", value: "Kovil Nadar" },
  { label: "Perunthondaman Nadar", value: "Perunthondaman Nadar" },
  { label: "Karukkupattai Nadar", value: "Karukkupattai Nadar" },
  { label: "Melnattar Nadar", value: "Melnattar Nadar" },
  { label: "Thennattar Nadar", value: "Thennattar Nadar" },

  // Christian Nadar Subcastes
  { label: "Roman Catholic Nadar", value: "Roman Catholic Nadar" },
  { label: "Protestant Nadar", value: "Protestant Nadar" },
  { label: "CSI Nadar", value: "CSI Nadar" },
  { label: "Pentecostal Nadar", value: "Pentecostal Nadar" },
  {
    label: "Seventh Day Adventist Nadar",
    value: "Seventh Day Adventist Nadar",
  },
  { label: "Evangelical Nadar", value: "Evangelical Nadar" },
  { label: "Independent Church Nadar", value: "Independent Church Nadar" },

  // Generic
  { label: "Other Nadar", value: "Other Nadar" },
];
const rasiOptions = [
  { label: "Mesham (Aries)", value: "Mesham" },
  { label: "Rishabam (Taurus)", value: "Rishabam" },
  { label: "Mithunam (Gemini)", value: "Mithunam" },
  { label: "Katakam (Cancer)", value: "Katakam" },
  { label: "Simmam (Leo)", value: "Simmam" },
  { label: "Kanni (Virgo)", value: "Kanni" },
  { label: "Thulam (Libra)", value: "Thulam" },
  { label: "Viruchigam (Scorpio)", value: "Viruchigam" },
  { label: "Dhanusu (Sagittarius)", value: "Dhanusu" },
  { label: "Makaram (Capricorn)", value: "Makaram" },
  { label: "Kumbam (Aquarius)", value: "Kumbam" },
  { label: "Meenam (Pisces)", value: "Meenam" },
];
const starOptions = [
  { label: "Ashwini", value: "Ashwini" },
  { label: "Bharani", value: "Bharani" },
  { label: "Karthigai", value: "Karthigai" },
  { label: "Rohini", value: "Rohini" },
  { label: "Mirugasirisham", value: "Mirugasirisham" },
  { label: "Thiruvathirai", value: "Thiruvathirai" },
  { label: "Punarpoosam", value: "Punarpoosam" },
  { label: "Poosam", value: "Poosam" },
  { label: "Ayilyam", value: "Ayilyam" },
  { label: "Magam", value: "Magam" },
  { label: "Pooram", value: "Pooram" },
  { label: "Uthiram", value: "Uthiram" },
  { label: "Hastham", value: "Hastham" },
  { label: "Chithirai", value: "Chithirai" },
  { label: "Swathi", value: "Swathi" },
  { label: "Visakam", value: "Visakam" },
  { label: "Anusham", value: "Anusham" },
  { label: "Kettai", value: "Kettai" },
  { label: "Moolam", value: "Moolam" },
  { label: "Pooradam", value: "Pooradam" },
  { label: "Uthiradam", value: "Uthiradam" },
  { label: "Thiruvonam", value: "Thiruvonam" },
  { label: "Avittam", value: "Avittam" },
  { label: "Sathayam", value: "Sathayam" },
  { label: "Poorattathi", value: "Poorattathi" },
  { label: "Uthirattathi", value: "Uthirattathi" },
  { label: "Revathi", value: "Revathi" },
];
const skinColorOptions = [
  { label: "Very Fair", value: "Very Fair" },
  { label: "Fair", value: "Fair" },
  { label: "Wheatish", value: "Wheatish" },
  { label: "Dark", value: "Dark" },
];
const heightOptions = [
  { label: "2' 0\"", value: "2' 0\"" },
  { label: "2' 3\"", value: "2' 3\"" },
  { label: "2' 6\"", value: "2' 6\"" },
  { label: "2' 9\"", value: "2' 9\"" },
  { label: "3' 0\"", value: "3' 0\"" },
  { label: "3' 3\"", value: "3' 3\"" },
  { label: "3' 6\"", value: "3' 6\"" },
  { label: "3' 9\"", value: "3' 9\"" },
  { label: "4' 0\"", value: "4' 0\"" },
  { label: "4' 3\"", value: "4' 3\"" },
  { label: "4' 6\"", value: "4' 6\"" },
  { label: "4' 9\"", value: "4' 9\"" },
  { label: "5' 0\"", value: "5' 0\"" },
  { label: "5' 3\"", value: "5' 3\"" },
  { label: "5' 6\"", value: "5' 6\"" },
  { label: "5' 9\"", value: "5' 9\"" },
  { label: "6' 0\"", value: "6' 0\"" },
  { label: "6' 3\"", value: "6' 3\"" },
  { label: "6' 6\"", value: "6' 6\"" },
  { label: "6' 9\"", value: "6' 9\"" },
  { label: "7' 0\"", value: "7' 0\"" },
  { label: "7' 3\"", value: "7' 3\"" },
  { label: "7' 6\"", value: "7' 6\"" },
  { label: "7' 9\"", value: "7' 9\"" },
  { label: "8' 0\"", value: "8' 0\"" },
  { label: "8' 3\"", value: "8' 3\"" },
  { label: "8' 6\"", value: "8' 6\"" },
  { label: "8' 9\"", value: "8' 9\"" },
  { label: "8' 11\"", value: "8' 11\"" },
];

const foodHabitOptions = [
  { label: "Vegetarian", value: "Veg" },
  { label: "Non-Vegetarian", value: "Non-Veg" },
  { label: "Eggetarian", value: "Egg" },
];
const motherTongueOptions = [
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Kannada", value: "Kannada" },

  // North & Central Indian
  { label: "Hindi", value: "Hindi" },
  { label: "Marathi", value: "Marathi" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Punjabi", value: "Punjabi" },

  // Neighboring countries
  { label: "Sinhala", value: "Sinhala" }, // Sri Lanka
  { label: "English (Sri Lankan)", value: "English (Sri Lankan)" },

  // Worldwide migration (common languages spoken by diaspora Nadars)
  { label: "English", value: "English" },
  { label: "French", value: "French" }, // France, Canada
  { label: "German", value: "German" }, // Germany
  { label: "Dutch", value: "Dutch" }, // Netherlands
  { label: "Spanish", value: "Spanish" }, // Spain, Latin America, US
  { label: "Arabic", value: "Arabic" }, // Middle East (UAE, Saudi, Qatar, etc.)
  { label: "Malay", value: "Malay" }, // Malaysia, Singapore
  { label: "Chinese (Mandarin)", value: "Chinese (Mandarin)" },
  { label: "Chinese (Cantonese)", value: "Chinese (Cantonese)" },
  { label: "Thai", value: "Thai" },
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
  const API_URL = "http://192.168.43.38:5000";
  const [initialData, setInitialData] = useState(initialValues);
  const [loading, setLoading] = useState(true);



  const fetchBasicDetails = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userString = await AsyncStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user || !user.id) {
      Alert.alert("Error", "User not found. Please login first.");
      setLoading(false);
      return;
    }

    const response = await fetch(`${API_URL}/user/${user.id}/basic`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("GET Error:", data.message);
      setLoading(false);
      return;
    }

    // ✅ Use `data.basicDetails` from your API response
    const userBasic = data.basicDetails;

    if (userBasic && Object.keys(userBasic).length > 0) {
      const parsedData = {
        ...initialValues,
        ...userBasic,
        dob: userBasic.dob ? new Date(userBasic.dob) : null, // convert date string
      };
      setInitialData(parsedData);
      console.log("✅ Loaded Basic Details:", parsedData);
    } else {
      console.log("ℹ️ No basic details found — showing empty form");
      setInitialData(initialValues);
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
  } finally {
    setLoading(false);
  }
};


  // ✅ Fetch user basic info on mount
  useEffect(() => {

    fetchBasicDetails();
  }, []);

  const handleRegistration = async (values: typeof initialValues) => {
    try {
      // Get user ID and token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user) {
        Alert.alert("Error", "No user found. Please login first.");
        return;
      }

      const userId = user.id; // get ID from stored user

      // Make PUT request with user ID in URL
      const response = await fetch(`${API_URL}/user/${userId}/basic`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to save data");
        return;
      }

      Alert.alert("Success", "Profile saved successfully!");
      console.log("Saved Data:", data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          enableReinitialize
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleRegistration}
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
                value={values.height} // e.g., "165"
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
                onValueChange={(val) => setFieldValue("physicalChallenge", val)}
                options={physicalChallengeOptions}
                error={errors.physicalChallenge}
                touched={touched.physicalChallenge}
              />



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
