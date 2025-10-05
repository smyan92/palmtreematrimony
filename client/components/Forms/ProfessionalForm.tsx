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

const initialValues = {
    higherEducation: '',
  jobTitle: '',
  monthlySalary: '',
  jobTown: '',
};

const validationSchema = Yup.object({
   higherEducation: Yup.string().required('Higher Education is required'),
  jobTitle: Yup.string().required('Job Title is required'),
  monthlySalary: Yup.string().required('Monthly Salary is required'),
  jobTown: Yup.string().required('Job Town is required'),
});
const higherEducationOptions = [
  { label: 'High School', value: 'highschool' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Undergraduate (UG)', value: 'ug' },
  { label: 'Postgraduate (PG)', value: 'pg' },
  { label: 'Doctorate (PhD)', value: 'phd' },
];

const jobTitleOptions = [
  { label: 'Software Engineer', value: 'software_engineer' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Business Owner', value: 'business_owner' },
  { label: 'Government Employee', value: 'govt_employee' },
  { label: 'Other', value: 'other' },
];

const jobTownOptions = [
  { label: 'Madurai', value: 'madurai' },
  { label: 'Chennai', value: 'chennai' },
  { label: 'Coimbatore', value: 'coimbatore' },
  { label: 'Trichy', value: 'trichy' },
  { label: 'Other', value: 'other' },
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
            <Dropdown
  label="Higher Education"
  value={values.higherEducation}
  onValueChange={(val) => setFieldValue('higherEducation', val)}
  options={higherEducationOptions}
  error={errors.higherEducation}
  touched={touched.higherEducation}
/>

<Dropdown
  label="Job Title"
  value={values.jobTitle}
  onValueChange={(val) => setFieldValue('jobTitle', val)}
  options={jobTitleOptions}
  error={errors.jobTitle}
  touched={touched.jobTitle}
/>

<FormTextInput
  label="Monthly Salary"
  placeholder="Enter monthly salary"
  value={values.monthlySalary}
  onChangeText={handleChange('monthlySalary')}
  onBlur={handleBlur('monthlySalary')}
  error={errors.monthlySalary}
  touched={touched.monthlySalary}
  keyboardType="numeric"
/>

<Dropdown
  label="Job Town"
  value={values.jobTown}
  onValueChange={(val) => setFieldValue('jobTown', val)}
  options={jobTownOptions}
  error={errors.jobTown}
  touched={touched.jobTown}
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
