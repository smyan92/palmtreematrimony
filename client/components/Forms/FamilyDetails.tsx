import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextInput from "@/components/Forms/TextInput";
import DatePickerInput from "@/components/Forms/DatePicker";
import Dropdown from "@/components/Forms/Dropdown";

const initialValues = {
  homeType: '',
  hasLoan: false,
  hasCar: false,
  propertyDetails: '',
  drinkingHabit: '',
};

const validationSchema = Yup.object({
    homeType: Yup.string().required('Home type is required'),
  hasLoan: Yup.boolean(),
  hasCar: Yup.boolean(),
  propertyDetails: Yup.string().max(300, 'Max 300 characters allowed'),
  drinkingHabit: Yup.string().required('Drinking habit is required'),
});
const homeTypeOptions = [
  { label: 'Own House', value: 'own' },
  { label: 'Rented House', value: 'rented' },
  { label: 'Living with Family', value: 'family' },
];

const drinkingHabitOptions = [
  { label: 'Never', value: 'never' },
  { label: 'Occasionally', value: 'occasionally' },
  { label: 'Regularly', value: 'regularly' },
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

           {/* 🏠 Home Type */}
<Dropdown
  label="Home Type"
  value={values.homeType}
  onValueChange={(val) => setFieldValue('homeType', val)}
  options={homeTypeOptions}
  error={errors.homeType}
  touched={touched.homeType}
/>

{/* 🏦 Do You Have Loan */}
<View style={styles.switchRow}>
  <Text style={styles.label}>Do you have a loan?</Text>
<Switch
  value={values.hasLoan}
  onValueChange={(val) => {
    setFieldValue('hasLoan', val);
  }}
/>
</View>

{/* 🚗 Have a Car */}
<View style={styles.switchRow}>
  <Text style={styles.label}>Have a car?</Text>
<Switch
  value={values.hasCar}
  onValueChange={(val) => {
    setFieldValue('hasCar', val);
  }}
/>
</View>

{/* 🏡 Property Details */}
<FormTextInput
  label="Property Details"
  placeholder="Enter property details..."
  value={values.propertyDetails}
  onChangeText={handleChange('propertyDetails')}
  onBlur={handleBlur('propertyDetails')}
  multiline
  numberOfLines={3}
  error={errors.propertyDetails}
  touched={touched.propertyDetails}
/>

{/* 🍺 Drinking Habit */}
<Dropdown
  label="Drinking Habit"
  value={values.drinkingHabit}
  onValueChange={(val) => setFieldValue('drinkingHabit', val)}
  options={drinkingHabitOptions}
  error={errors.drinkingHabit}
  touched={touched.drinkingHabit}
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
