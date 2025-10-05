import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextInput from "@/components/Forms/TextInput";
import DatePickerInput from "@/components/Forms/DatePicker";
import Dropdown from "@/components/Forms/Dropdown";
import PhotoUpload from "@/components/Forms/Pho";

const initialValues = {
  fullName: "",
  dob: null,
  homeTown: "",
  religion: '', 
  subCaste: '',
  rasi: '',
  star: '',
  skinColor: '',
  height: '',
   weight: '',
  foodHabit: '',
  motherTongue: '',
  chevaiDosham: '',
  goldWeight: '',
  physicalChallenge: '',
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  homeTown: Yup.string().required("HomeTown is required"),
     religion: Yup.string().required('Religion is required'),
  subCaste: Yup.string().required('Subcaste is required'),
  rasi: Yup.string().required('Rasi is required'),
  star: Yup.string().required('Star is required'),
  skinColor: Yup.string().required('Skin color is required'),
  height: Yup.string().required('Height is required'),
   weight: Yup.string().required('Weight is required'),
  foodHabit: Yup.string().required('Food habit is required'),
  motherTongue: Yup.string().required('Mother tongue is required'),
  chevaiDosham: Yup.string().required('Chevai dosham is required'),
  goldWeight: Yup.string().required('Gold weight is required'),
  physicalChallenge: Yup.string().required('Physical challenge status is required'),
});

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
  { label: 'Iyer', value: 'iyer' },
  { label: 'Iyengar', value: 'iyengar' },
];

const rasiOptions = [
  { label: 'Mesh', value: 'mesh' },
  { label: 'Rishab', value: 'rishab' },
];

const starOptions = [
  { label: 'Ashwini', value: 'ashwini' },
  { label: 'Bharani', value: 'bharani' },
];

const skinColorOptions = [
  { label: 'Fair', value: 'fair' },
  { label: 'Wheatish', value: 'wheatish' },
  { label: 'Dark', value: 'dark' },
];

const heightOptions = [
  { label: '4.5 ft', value: '4.5' },
  { label: '5 ft', value: '5' },
  { label: '5.5 ft', value: '5.5' },
];
const foodHabitOptions = [
  { label: 'Vegetarian', value: 'veg' },
  { label: 'Non-Vegetarian', value: 'nonveg' },
  { label: 'Eggetarian', value: 'egg' },
];

const motherTongueOptions = [
  { label: 'Tamil', value: 'tamil' },
  { label: 'Telugu', value: 'telugu' },
  { label: 'Malayalam', value: 'malayalam' },
  { label: 'Kannada', value: 'kannada' },
];

const chevaiDoshamOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Don’t Know', value: 'unknown' },
];

const physicalChallengeOptions = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
  { label: 'Partially', value: 'partial' },
];


export default function App() {
  const handleRegistration = (values: typeof initialValues) => {
    console.log("Form Submitted:", values);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={initialValues}
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
            isValid,
            setFieldValue,
          }) => (
            <View>
              <FormTextInput
                label="Full Name"
                placeholder="Enter your name"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={errors.fullName}
                touched={touched.fullName}
              />

              <DatePickerInput
                label="Date of Birth"
                value={values.dob}
                onChange={(date) => setFieldValue("dob", date)}
                error={errors.dob}
                touched={touched.dob}
                maximumDate={new Date()}
              />
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
  onValueChange={(val) => setFieldValue('religion', val)}
  options={religionOptions}
  error={errors.religion}
  touched={touched.religion}
/>
<Dropdown
  label="Subcaste"
  value={values.subCaste}
  onValueChange={(val) => setFieldValue('subCaste', val)}
  options={subCasteOptions}
  error={errors.subCaste}
  touched={touched.subCaste}
/>

<Dropdown
  label="Rasi"
  value={values.rasi}
  onValueChange={(val) => setFieldValue('rasi', val)}
  options={rasiOptions}
  error={errors.rasi}
  touched={touched.rasi}
/>

<Dropdown
  label="Star"
  value={values.star}
  onValueChange={(val) => setFieldValue('star', val)}
  options={starOptions}
  error={errors.star}
  touched={touched.star}
/>

<Dropdown
  label="Skin Color"
  value={values.skinColor}
  onValueChange={(val) => setFieldValue('skinColor', val)}
  options={skinColorOptions}
  error={errors.skinColor}
  touched={touched.skinColor}
/>

<Dropdown
  label="Height"
  value={values.height}
  onValueChange={(val) => setFieldValue('height', val)}
  options={heightOptions}
  error={errors.height}
  touched={touched.height}
/>
<FormTextInput
  label="Weight (kg)"
  placeholder="Enter your weight"
  value={values.weight}
  onChangeText={handleChange('weight')}
  onBlur={handleBlur('weight')}
  error={errors.weight}
  touched={touched.weight}
/>

<Dropdown
  label="Food Habit"
  value={values.foodHabit}
  onValueChange={(val) => setFieldValue('foodHabit', val)}
  options={foodHabitOptions}
  error={errors.foodHabit}
  touched={touched.foodHabit}
/>

<Dropdown
  label="Mother Tongue"
  value={values.motherTongue}
  onValueChange={(val) => setFieldValue('motherTongue', val)}
  options={motherTongueOptions}
  error={errors.motherTongue}
  touched={touched.motherTongue}
/>

<Dropdown
  label="Chevai Dosham"
  value={values.chevaiDosham}
  onValueChange={(val) => setFieldValue('chevaiDosham', val)}
  options={chevaiDoshamOptions}
  error={errors.chevaiDosham}
  touched={touched.chevaiDosham}
/>

<FormTextInput
  label="Gold Weight (in Pown)"
  placeholder="Enter gold weight"
  value={values.goldWeight}
  onChangeText={handleChange('goldWeight')}
  onBlur={handleBlur('goldWeight')}
  error={errors.goldWeight}
  touched={touched.goldWeight}
/>

<Dropdown
  label="Physical Challenge"
  value={values.physicalChallenge}
  onValueChange={(val) => setFieldValue('physicalChallenge', val)}
  options={physicalChallengeOptions}
  error={errors.physicalChallenge}
  touched={touched.physicalChallenge}
/>

              <TouchableOpacity
                style={[styles.button, !isValid && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={!isValid}
                activeOpacity={0.8}
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
