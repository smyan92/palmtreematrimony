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
import PhotoUpload  from "@/components/Forms/PhotoUpload";

const initialValues = {
mobile: "",
alternativeNumber: "",
photos: [],
};

const validationSchema = Yup.object({
   mobile: Yup.string()
  .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number")
  .required("Mobile number is required"),
alternativeNumber: Yup.string()
  .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit number")
  .notOneOf([Yup.ref("mobile")], "Alternative number must be different"),
photos: Yup.array()
  .min(1, "At least 1 photo required")
  .max(3, "Max 3 photos allowed"),

});


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
  label="Mobile Number"
  placeholder="Enter mobile number"
  keyboardType="phone-pad"
  value={values.mobile}
  onChangeText={handleChange("mobile")}
  onBlur={handleBlur("mobile")}
  error={errors.mobile}
  touched={touched.mobile}
/>

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

<PhotoUpload
  label="Upload Photos"
  photos={values.photos}
  onChange={(newPhotos) => setFieldValue("photos", newPhotos)}
  error={errors.photos as string}   // use 'errors.photos', NOT 'error'
  touched={touched.photos}          // use 'touched.photos'
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
