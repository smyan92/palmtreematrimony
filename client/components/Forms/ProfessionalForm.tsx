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
import Dropdown from "@/components/Forms/Dropdown";

const initialValues = {
  higherEducation: '',
  jobTitle: '',
  monthlySalary: '',
  jobTown: '',
};

const validationSchema = Yup.object({
  higherEducation: Yup.string()
    .required("Higher Education is required")
    .oneOf(
      ["highschool", "diploma", "ug", "pg", "phd"],
      "Select a valid education option"
    ),

  jobTitle: Yup.string()
    .required("Job Title is required")
    .oneOf(
      ["software_engineer", "teacher", "business_owner", "govt_employee", "other"],
      "Select a valid job title"
    ),

  monthlySalary: Yup.number()
    .typeError("Monthly Salary must be a number")
    .min(0, "Salary cannot be negative")
    .required("Monthly Salary is required"),

  jobTown: Yup.string()
    .required("Job Town is required")
    .oneOf(
      ["madurai", "chennai", "coimbatore", "trichy", "other"],
      "Select a valid job town"
    ),
});

const higherEducationOptions = [
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

const jobTitleOptions = [
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

const jobTownOptions = [
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
            dirty,
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
