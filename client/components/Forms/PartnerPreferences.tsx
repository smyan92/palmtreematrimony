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
import Dropdown from "@/components/Forms/Dropdown";
import MultiDropdown from "@/components/Forms/MultiDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define initial values for the form fields
const initialValues = {
  partnerAgeFrom: "",
  partnerAgeTo: "",
  partnerMaritalStatus: "",
  partnerHometown: "",
  partnerJobTown: [] as string[],
  partnerReligion: "",
  partnerSubcaste: "",
  partnerEducation: "",
  partnerJob: "",
  partnerSalary: "",
  partnerHometownMulti: [] as string[],
  partnerChevai: "",
  partnerPhysicalChallenge: "",
  partnerHouseType: "",
  partnerGold: "",
  partnerSkinColor: "",
  partnerStarMulti: [] as string[],
  partnerRasiMulti: [] as string[],
};
type partnertDetails = typeof initialValues;

// Form validation schema
const validationSchema = Yup.object({
  partnerAgeFrom: Yup.number()
    .typeError("Age From must be a number")
    .required("Age From is required")
    .positive("Age must be positive"),
  partnerAgeTo: Yup.number()
    .typeError("Age To must be a number")
    .required("Age To is required")
    .positive("Age must be positive")
    .min(Yup.ref("partnerAgeFrom"), "Age To must be greater than Age From"),
  partnerMaritalStatus: Yup.string().required("Select marital status"),
  partnerHometown: Yup.string().required("Select hometown"),
  partnerJobTown: Yup.array().min(1, "Select at least 1 job town"),
  partnerReligion: Yup.string().required("Select religion"),
  partnerSubcaste: Yup.string().required("Select subcaste"),
  partnerEducation: Yup.string().required("Select education"),
  partnerJob: Yup.string().required("Select job"),
  partnerSalary: Yup.string().required("Salary required"),
  partnerHometownMulti: Yup.array().min(1, "Select at least 1 hometown"),
  partnerChevai: Yup.string().required("Select Chevai/Dhosam"),
  partnerPhysicalChallenge: Yup.string().required("Select physical challenge"),
  partnerHouseType: Yup.string().required("Select house type"),
  partnerGold: Yup.string().required("Gold weight required"),
  partnerSkinColor: Yup.string().required("Select skin color"),
  partnerStarMulti: Yup.array().min(1, "Select at least 1 star"),
  partnerRasiMulti: Yup.array().min(1, "Select at least 1 rasi"),
});

// Mock API URL (replace with actual if needed)
const API_URL = "http://192.168.43.38:5000";

// Sample options (kept as is)
const maritalStatusOptions = [
  { label: "Single", value: "single" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
];

const religionOptions = [
  { label: "Hindu", value: "hindu" },
  { label: "Christian", value: "christian" },
];

const subcasteOptions = [
  // Hindu Nadar Subcastes
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
  { label: "Seventh Day Adventist Nadar", value: "Seventh Day Adventist Nadar" },
  { label: "Evangelical Nadar", value: "Evangelical Nadar" },
  { label: "Independent Church Nadar", value: "Independent Church Nadar" },

  // Generic
  { label: "Other Nadar", value: "Other Nadar" },
];

const educationOptions = [
  { "label": "Ph.D. / Doctoral Degree", "value": "PhD" },
  { "label": "M.Tech (Master of Technology)", "value": "MTech" },
  { "label": "M.E. (Master of Engineering)", "value": "ME" },
  { "label": "M.C.A. (Master of Computer Applications)", "value": "MCA" },
  { "label": "M.Sc. (Master of Science)", "value": "MSc" },
  { "label": "M.A. (Master of Arts)", "value": "MA" },
  { "label": "M.Com (Master of Commerce)", "value": "MCom" },
  { "label": "B.Tech (Bachelor of Technology)", "value": "BTech" },
  { "label": "B.E. (Bachelor of Engineering)", "value": "BE" },
  { "label": "B.Sc. (Bachelor of Science)", "value": "BSc" },
  { "label": "B.A. (Bachelor of Arts)", "value": "BA" },
  { "label": "B.Com (Bachelor of Commerce)", "value": "BCom" },
  { "label": "MBBS / BDS / BAMS (Medical)", "value": "Medical" },
  { "label": "CA / CS / ICWA (Finance/Accounting)", "value": "Finance" },
  { "label": "Other Graduate Degree", "value": "OtherGrad" },
  { "label": "Diploma / ITI", "value": "Diploma/ITI" },
  { "label": "High School / School Level", "value": "HighSchool" }
];

const jobOptions = [
  { label: 'Software Engineer', value: 'Software Engineer' },
  { label: 'Web Developer', value: 'Web Developer' },
  { label: 'Mobile App Developer', value: 'Mobile App Developer' },
  { label: 'Data Scientist', value: 'Data Scientist' },
  { label: 'UI/UX Designer', value: 'UI/UX Designer' },
  { label: 'Digital Marketing Specialist', value: 'Digital Marketing Specialist' },
  { label: 'Financial Analyst', value: 'Financial Analyst' },
  { label: 'Banking Professional', value: 'Banking Professional' },
  { label: 'Chartered Accountant', value: 'Chartered Accountant' },
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Nurse', value: 'Nurse' },
  { label: 'Teacher', value: 'Teacher' },
  { label: 'Professor', value: 'Professor' },
  { label: 'Lawyer', value: 'Lawyer' },
  { label: 'Civil Engineer', value: 'Civil Engineer' },
  { label: 'Mechanical Engineer', value: 'Mechanical Engineer' },
  { label: 'Electrical Engineer', value: 'Electrical Engineer' },
  { label: 'Pilot', value: 'Pilot' },
  { label: 'Air Hostess', value: 'Air Hostess' },
  { label: 'Entrepreneur', value: 'Entrepreneur' },
  { label: 'Business Owner', value: 'Business Owner' },
  { label: 'Government Employee', value: 'Government Employee' },
  { label: 'IT Professional', value: 'IT Professional' },
  { label: 'Marketing Manager', value: 'Marketing Manager' },
  { label: 'HR Manager', value: 'HR Manager' },
  { label: 'Scientist', value: 'Scientist' },
  { label: 'Research Analyst', value: 'Research Analyst' },
  { label: 'Artist', value: 'Artist' },
  { label: 'Actor/Actress', value: 'Actor/Actress' },
  { label: 'Chef', value: 'Chef' },
  { label: 'Pilot', value: 'Pilot' },
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

const hometownOptions = [
  { label: 'Chennai', value: 'Chennai' },
  { label: 'Coimbatore', value: 'Coimbatore' },
  { label: 'Madurai', value: 'Madurai' },
  { label: 'Tiruchirappalli', value: 'Tiruchirappalli' },
  { label: 'Salem', value: 'Salem' },
  { label: 'Ambattur', value: 'Ambattur' },
  { label: 'Tirunelveli', value: 'Tirunelveli' },
  { label: 'Tiruppur', value: 'Tiruppur' },
  { label: 'Avadi', value: 'Avadi' },
  { label: 'Tiruvottiyur', value: 'Tiruvottiyur' },
  { label: 'Thoothukkudi', value: 'Thoothukkudi' },
  { label: 'Nagercoil', value: 'Nagercoil' },
  { label: 'Thanjavur', value: 'Thanjavur' },
  { label: 'Pallavaram', value: 'Pallavaram' },
  { label: 'Dindigul', value: 'Dindigul' },
  { label: 'Vellore', value: 'Vellore' },
  { label: 'Tambaram', value: 'Tambaram' },
  { label: 'Cuddalore', value: 'Cuddalore' },
  { label: 'Kancheepuram', value: 'Kancheepuram' },
  { label: 'Alandur', value: 'Alandur' },
  { label: 'Erode', value: 'Erode' },
  { label: 'Tiruvannamalai', value: 'Tiruvannamalai' },
  { label: 'Kumbakonam', value: 'Kumbakonam' },
  { label: 'Rajapalayam', value: 'Rajapalayam' },
  { label: 'Kurichi', value: 'Kurichi' },
  { label: 'Madavaram', value: 'Madavaram' },
  { label: 'Pudukkottai', value: 'Pudukkottai' },
  { label: 'Hosur', value: 'Hosur' },
  { label: 'Ambur', value: 'Ambur' },
  { label: 'Karaikkudi', value: 'Karaikkudi' },
  { label: 'Neyveli', value: 'Neyveli' },
  { label: 'Nagapattinam', value: 'Nagapattinam' },
  { label: 'Bengaluru', value: 'Bengaluru' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Kolkata', value: 'Kolkata' },
  { label: 'Pune', value: 'Pune' },
  { label: 'Jaipur', value: 'Jaipur' },
  { label: 'Lucknow', value: 'Lucknow' },
  { label: 'Nagpur', value: 'Nagpur' },
  { label: 'Visakhapatnam', value: 'Visakhapatnam' },
  { label: 'Bhubaneswar', value: 'Bhubaneswar' },
  { label: 'Chandigarh', value: 'Chandigarh' },
  { label: 'Gurugram', value: 'Gurugram' },
  { label: 'Noida', value: 'Noida' },
  { label: 'Kochi', value: 'Kochi' },
  { label: 'Vijayawada', value: 'Vijayawada' },
];

const chevaiOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const physicalChallengeOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const houseTypeOptions = [
  { label: "Apartment", value: "apartment" },
  { label: "Independent", value: "independent" },
];

const skinColorOptions = [
  { label: "Fair", value: "fair" },
  { label: "Wheatish", value: "wheatish" },
];

// Rasi options are usually the same as Star options in this context
const rasiOptions = starOptions;

export default function PartnerPreferenceForm() {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<partnertDetails>(initialValues);

  /**
   * Fetches the user's existing partner preferences from the API.
   */
  const fetchPartnerPreferences = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/user/${userId}/partnerPreferences`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        // If the resource doesn't exist (e.g., first time), it's fine.
        // We will default to initialValues.
        if (res.status !== 404) {
             throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        setInitialData(initialValues);
        return;
      }
      
      const data = await res.json();
      const preferences = data.partnerPreferences || {}; // Assume the preferences are in a key called partnerPreferences
      
      // FIX: Map the fetched data to the initialValues structure,
      // ensuring arrays are not null/undefined and using empty strings as fallbacks
      setInitialData({
        partnerAgeFrom: (preferences.partnerAgeFrom ?? initialValues.partnerAgeFrom).toString(),
        partnerAgeTo: (preferences.partnerAgeTo ?? initialValues.partnerAgeTo).toString(),
        partnerMaritalStatus: preferences.partnerMaritalStatus || initialValues.partnerMaritalStatus,
        partnerHometown: preferences.partnerHometown || initialValues.partnerHometown,
        partnerJobTown: preferences.partnerJobTown || initialValues.partnerJobTown,
        partnerReligion: preferences.partnerReligion || initialValues.partnerReligion,
        partnerSubcaste: preferences.partnerSubcaste || initialValues.partnerSubcaste,
        partnerEducation: preferences.partnerEducation || initialValues.partnerEducation,
        partnerJob: preferences.partnerJob || initialValues.partnerJob,
        partnerSalary: preferences.partnerSalary || initialValues.partnerSalary,
        partnerHometownMulti: preferences.partnerHometownMulti || initialValues.partnerHometownMulti,
        partnerChevai: preferences.partnerChevai || initialValues.partnerChevai,
        partnerPhysicalChallenge: preferences.partnerPhysicalChallenge || initialValues.partnerPhysicalChallenge,
        partnerHouseType: preferences.partnerHouseType || initialValues.partnerHouseType,
        partnerGold: (preferences.partnerGold ?? initialValues.partnerGold).toString(),
        partnerSkinColor: preferences.partnerSkinColor || initialValues.partnerSkinColor,
        partnerStarMulti: preferences.partnerStarMulti || initialValues.partnerStarMulti,
        partnerRasiMulti: preferences.partnerRasiMulti || initialValues.partnerRasiMulti,
      });

    } catch (err) {
      console.error("Fetch Partner Preferences Error:", err);
      Alert.alert("Error", "Failed to load partner preferences");
      // Fallback: Use initial empty values
      setInitialData(initialValues);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerPreferences();
  }, []);

  /**
   * Submits the form data to update partner preferences.
   * @param values The form values from Formik.
   */
  const handleSavePreferences = async (values: typeof initialValues) => {
    // Convert age and gold fields to numbers for API, handling the case where Yup made them strings
Alert.alert("hii");

    const valuesForAPI = {
        ...values,
        partnerAgeFrom: parseInt(values.partnerAgeFrom, 10),
        partnerAgeTo: parseInt(values.partnerAgeTo, 10),
        partnerGold: parseFloat(values.partnerGold),
    };
     const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;
  if (!token || !userId) {
        Alert.alert("Error", "Authentication failed. Please log in again.");
        return;
      }

console.log(JSON.stringify(valuesForAPI));
  const response = await fetch(`${API_URL}/user/${userId}/partnerPreferences`, {
        method: "PUT", // Use PUT for update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(valuesForAPI),
      });

      const data = await response.json();
     Alert.alert("Response", JSON.stringify(data));


  };
  
  // Display a loading indicator while fetching initial data
  if (loading) {
      return (
          <SafeAreaView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={{ marginTop: 10 }}>Loading Preferences...</Text>
          </SafeAreaView>
      );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Formik
          // Use the fetched initialData
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSavePreferences} // Updated function name
          enableReinitialize={true} // Important to update form when initialData changes
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
            setFieldValue,
          }) => (
            <View>
              {/* Partner Name */}
        

              {/* Age From/To */}
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FormTextInput
                    label="Age From"
                    value={values.partnerAgeFrom}
                    onChangeText={handleChange("partnerAgeFrom")}
                    onBlur={handleBlur("partnerAgeFrom")}
                    error={errors.partnerAgeFrom as string}
                    touched={!!touched.partnerAgeFrom}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <FormTextInput
                    label="Age To"
                    value={values.partnerAgeTo}
                    onChangeText={handleChange("partnerAgeTo")}
                    onBlur={handleBlur("partnerAgeTo")}
                    error={errors.partnerAgeTo as string}
                    touched={!!touched.partnerAgeTo}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Marital Status */}
              <Dropdown
                label="Marital Status"
                value={values.partnerMaritalStatus}
                onValueChange={(val) => setFieldValue("partnerMaritalStatus", val)}
                options={maritalStatusOptions}
                error={errors.partnerMaritalStatus as string}
                touched={!!touched.partnerMaritalStatus}
              />

              {/* Hometown (Single Select) */}
              <Dropdown
                label="Hometown (Single Select)"
                value={values.partnerHometown}
                onValueChange={(val) => setFieldValue("partnerHometown", val)}
                options={hometownOptions}
                error={errors.partnerHometown as string}
                touched={!!touched.partnerHometown}
              />

              {/* Job Town (Multi Select) */}
              <MultiDropdown
                label="Job Town (Multi Select)"
                selectedValues={values.partnerJobTown}
                onValuesChange={(val) => setFieldValue("partnerJobTown", val)}
                options={hometownOptions}
                error={errors.partnerJobTown as string[] | undefined}
                touched={!!touched.partnerJobTown}
              />

              {/* Religion */}
              <Dropdown
                label="Religion"
                value={values.partnerReligion}
                onValueChange={(val) => setFieldValue("partnerReligion", val)}
                options={religionOptions}
                error={errors.partnerReligion as string}
                touched={!!touched.partnerReligion}
              />

              {/* Subcaste */}
              <Dropdown
                label="Subcaste"
                value={values.partnerSubcaste}
                onValueChange={(val) => setFieldValue("partnerSubcaste", val)}
                options={subcasteOptions}
                error={errors.partnerSubcaste as string}
                touched={!!touched.partnerSubcaste}
              />

              {/* Education */}
              <Dropdown
                label="Education"
                value={values.partnerEducation}
                onValueChange={(val) => setFieldValue("partnerEducation", val)}
                options={educationOptions}
                error={errors.partnerEducation as string}
                touched={!!touched.partnerEducation}
              />

              {/* Job */}
              <Dropdown
                label="Job"
                value={values.partnerJob}
                onValueChange={(val) => setFieldValue("partnerJob", val)}
                options={jobOptions}
                error={errors.partnerJob as string}
                touched={!!touched.partnerJob}
              />

              {/* Salary */}
              <FormTextInput
                label="Salary"
                value={values.partnerSalary}
                onChangeText={handleChange("partnerSalary")}
                onBlur={handleBlur("partnerSalary")}
                error={errors.partnerSalary as string}
                touched={!!touched.partnerSalary}
                keyboardType="numeric"
              />


              {/* Hometown Multi (Multi Select) */}
              <MultiDropdown
                label="Preferred Hometowns (Multi Select)"
                selectedValues={values.partnerHometownMulti || []}
                onValuesChange={(val) => setFieldValue("partnerHometownMulti", val)}
                options={hometownOptions}
                error={errors.partnerHometownMulti as string[] | undefined}
                touched={!!touched.partnerHometownMulti}
              />

              {/* Chevai/Dhosam */}
              <Dropdown
                label="Chevai/Dhosam"
                value={values.partnerChevai}
                onValueChange={(val) => setFieldValue("partnerChevai", val)}
                options={chevaiOptions}
                error={errors.partnerChevai as string}
                touched={!!touched.partnerChevai}
              />

              {/* Physical Challenge */}
              <Dropdown
                label="Physical Challenge"
                value={values.partnerPhysicalChallenge}
                onValueChange={(val) => setFieldValue("partnerPhysicalChallenge", val)}
                options={physicalChallengeOptions}
                error={errors.partnerPhysicalChallenge as string}
                touched={!!touched.partnerPhysicalChallenge}
              />

              {/* House Type */}
              <Dropdown
                label="House Type"
                value={values.partnerHouseType}
                onValueChange={(val) => setFieldValue("partnerHouseType", val)}
                options={houseTypeOptions}
                error={errors.partnerHouseType as string}
                touched={!!touched.partnerHouseType}
              />

              {/* Gold */}
              <FormTextInput
                label="Gold (in grams)"
                value={values.partnerGold}
                onChangeText={handleChange("partnerGold")}
                onBlur={handleBlur("partnerGold")}
                error={errors.partnerGold as string}
                touched={!!touched.partnerGold}
                keyboardType="numeric"
              />

              {/* Skin Color */}
              <Dropdown
                label="Skin Color"
                value={values.partnerSkinColor}
                onValueChange={(val) => setFieldValue("partnerSkinColor", val)}
                options={skinColorOptions}
                error={errors.partnerSkinColor as string}
                touched={!!touched.partnerSkinColor}
              />

              {/* Star Multi */}
              <MultiDropdown
                label="Star (Multi Select)"
                selectedValues={values.partnerStarMulti || []}
                onValuesChange={(val) => setFieldValue("partnerStarMulti", val)}
                options={starOptions}
                error={errors.partnerStarMulti as string[] | undefined}
                touched={!!touched.partnerStarMulti}
              />

              {/* Rasi Multi */}
              <MultiDropdown
                label="Rasi (Multi Select)"
                selectedValues={values.partnerRasiMulti || []}
                onValuesChange={(val) => setFieldValue("partnerRasiMulti", val)}
                options={rasiOptions} // Using rasiOptions (same as starOptions)
                error={errors.partnerRasiMulti as string[] | undefined}
                touched={!!touched.partnerRasiMulti}
              />

              {/* Fill Test Data Button */}
              <TouchableOpacity
                style={styles.fillButton}
                onPress={() => {
                  setFieldValue("partnerAgeFrom", "25");
                  setFieldValue("partnerAgeTo", "30");
                  setFieldValue("partnerMaritalStatus", "single");
                  // Use a value that exists in hometownOptions
                  setFieldValue("partnerHometown", "Madurai");
                  // Use values that exist in hometownOptions
                  setFieldValue("partnerJobTown", ["Chennai", "Bengaluru"]);
                  setFieldValue("partnerReligion", "hindu");
                  // Use a value that exists in subcasteOptions
                  setFieldValue("partnerSubcaste", "Nadar"); 
                  // Use a value that exists in educationOptions
                  setFieldValue("partnerEducation", "BTech"); 
                  // Use a value that exists in jobOptions
                  setFieldValue("partnerJob", "Software Engineer"); 
                  setFieldValue("partnerSalary", "50000");
                  // Use values that exist in hometownOptions
                  setFieldValue("partnerHometownMulti", ["Madurai", "Chennai"]);
                  setFieldValue("partnerChevai", "no");
                  setFieldValue("partnerPhysicalChallenge", "no");
                  setFieldValue("partnerHouseType", "apartment");
                  setFieldValue("partnerGold", "50");
                  setFieldValue("partnerSkinColor", "fair");
                  // Use values that exist in starOptions
                  setFieldValue("partnerStarMulti", ["Ashwini", "Bharani"]);
                  // Use values that exist in starOptions/rasiOptions
                  setFieldValue("partnerRasiMulti", ["Ashwini", "Bharani"]); 
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                  Fill Test Data
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.button, (!isValid || !dirty) && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={!isValid || !dirty}
              >
                <Text style={styles.buttonText}>Save Preferences</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: "600",
    fontSize: 16,
  },
  fillButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
});