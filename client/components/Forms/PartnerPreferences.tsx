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
import Dropdown from "@/components/Forms/Dropdown";
import MultiDropdown from "@/components/Forms/MultiDropdown";

const initialValues = {
  partnerName: "",
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
  partnerStar: "",
  partnerHometownMulti: [] as string[],
  partnerChevai: "",
  partnerPhysicalChallenge: "",
  partnerHouseType: "",
  partnerGold: "",
  partnerSkinColor: "",
  partnerStarMulti: [] as string[],
  partnerRasiMulti: [] as string[],
};

const validationSchema = Yup.object({
  partnerName: Yup.string().required("Partner name is required"),
  partnerAgeFrom: Yup.number()
    .typeError("Age From must be a number")
    .required("Age From is required"),
  partnerAgeTo: Yup.number()
    .typeError("Age To must be a number")
    .required("Age To is required")
    .min(Yup.ref("partnerAgeFrom"), "Age To must be greater than Age From"),
  partnerMaritalStatus: Yup.string().required("Select marital status"),
  partnerHometown: Yup.string().required("Select hometown"),
  partnerJobTown: Yup.array().min(1, "Select at least 1 job town"),
  partnerReligion: Yup.string().required("Select religion"),
  partnerSubcaste: Yup.string().required("Select subcaste"),
  partnerEducation: Yup.string().required("Select education"),
  partnerJob: Yup.string().required("Select job"),
  partnerSalary: Yup.string().required("Salary required"),
  partnerStar: Yup.string().required("Select star"),
  partnerHometownMulti: Yup.array().min(1, "Select at least 1 hometown"),
  partnerChevai: Yup.string().required("Select Chevai/Dhosam"),
  partnerPhysicalChallenge: Yup.string().required("Select physical challenge"),
  partnerHouseType: Yup.string().required("Select house type"),
  partnerGold: Yup.string().required("Gold weight required"),
  partnerSkinColor: Yup.string().required("Select skin color"),
  partnerStarMulti: Yup.array().min(1, "Select at least 1 star"),
  partnerRasiMulti: Yup.array().min(1, "Select at least 1 rasi"),
});

// Sample options
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
  { label: "Iyer", value: "iyer" },
  { label: "Nadar", value: "nadar" },
];

const educationOptions = [
  { label: "Bachelors", value: "bachelors" },
  { label: "Masters", value: "masters" },
];

const jobOptions = [
  { label: "Engineer", value: "engineer" },
  { label: "Teacher", value: "teacher" },
];

const starOptions = [
  { label: "Ashwini", value: "ashwini" },
  { label: "Bharani", value: "bharani" },
];

const hometownOptions = [
  { label: "Chennai", value: "chennai" },
  { label: "Madurai", value: "madurai" },
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

export default function PartnerPreferenceForm() {
  const handleRegistration = (values: typeof initialValues) => {
    console.log("Form Submitted:", values);
    alert("Form submitted successfully!");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
            dirty,
            setFieldValue,
          }) => (
            <View>
              <FormTextInput
                label="Partner Name"
                value={values.partnerName}
                onChangeText={handleChange("partnerName")}
                onBlur={handleBlur("partnerName")}
                error={errors.partnerName as string}
                touched={!!touched.partnerName}
              />

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <FormTextInput
                  label="Age From"
                  value={values.partnerAgeFrom}
                  onChangeText={handleChange("partnerAgeFrom")}
                  onBlur={handleBlur("partnerAgeFrom")}
                  error={errors.partnerAgeFrom as string}
                  touched={!!touched.partnerAgeFrom}
                  keyboardType="numeric"
                />
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

              <Dropdown
                label="Marital Status"
                value={values.partnerMaritalStatus}
                onValueChange={(val) => setFieldValue("partnerMaritalStatus", val)}
                options={maritalStatusOptions}
                error={errors.partnerMaritalStatus as string}
                touched={!!touched.partnerMaritalStatus}
              />

              <Dropdown
                label="Hometown"
                value={values.partnerHometown}
                onValueChange={(val) => setFieldValue("partnerHometown", val)}
                options={hometownOptions}
                error={errors.partnerHometown as string}
                touched={!!touched.partnerHometown}
              />

              <MultiDropdown
                label="Job Town"
                selectedValues={values.partnerJobTown}
                onValuesChange={(val) => setFieldValue("partnerJobTown", val)}
                options={hometownOptions}
                error={errors.partnerJobTown as string[]}
                touched={!!touched.partnerJobTown}
              />

              <Dropdown
                label="Religion"
                value={values.partnerReligion}
                onValueChange={(val) => setFieldValue("partnerReligion", val)}
                options={religionOptions}
                error={errors.partnerReligion as string}
                touched={!!touched.partnerReligion}
              />

              <Dropdown
                label="Subcaste"
                value={values.partnerSubcaste}
                onValueChange={(val) => setFieldValue("partnerSubcaste", val)}
                options={subcasteOptions}
                error={errors.partnerSubcaste as string}
                touched={!!touched.partnerSubcaste}
              />

              <Dropdown
                label="Education"
                value={values.partnerEducation}
                onValueChange={(val) => setFieldValue("partnerEducation", val)}
                options={educationOptions}
                error={errors.partnerEducation as string}
                touched={!!touched.partnerEducation}
              />

              <Dropdown
                label="Job"
                value={values.partnerJob}
                onValueChange={(val) => setFieldValue("partnerJob", val)}
                options={jobOptions}
                error={errors.partnerJob as string}
                touched={!!touched.partnerJob}
              />

              <FormTextInput
                label="Salary"
                value={values.partnerSalary}
                onChangeText={handleChange("partnerSalary")}
                onBlur={handleBlur("partnerSalary")}
                error={errors.partnerSalary as string}
                touched={!!touched.partnerSalary}
              />

              <Dropdown
                label="Star"
                value={values.partnerStar}
                onValueChange={(val) => setFieldValue("partnerStar", val)}
                options={starOptions}
                error={errors.partnerStar as string}
                touched={!!touched.partnerStar}
              />

              <MultiDropdown
                label="Hometown Multi"
                selectedValues={values.partnerHometownMulti || []}
                onValuesChange={(val) => setFieldValue("partnerHometownMulti", val)}
                options={hometownOptions}
                error={errors.partnerHometownMulti as string[] | undefined}
                touched={!!touched.partnerHometownMulti}
              />

              <Dropdown
                label="Chevai/Dhosam"
                value={values.partnerChevai}
                onValueChange={(val) => setFieldValue("partnerChevai", val)}
                options={chevaiOptions}
                error={errors.partnerChevai as string}
                touched={!!touched.partnerChevai}
              />

              <Dropdown
                label="Physical Challenge"
                value={values.partnerPhysicalChallenge}
                onValueChange={(val) => setFieldValue("partnerPhysicalChallenge", val)}
                options={physicalChallengeOptions}
                error={errors.partnerPhysicalChallenge as string}
                touched={!!touched.partnerPhysicalChallenge}
              />

              <Dropdown
                label="House Type"
                value={values.partnerHouseType}
                onValueChange={(val) => setFieldValue("partnerHouseType", val)}
                options={houseTypeOptions}
                error={errors.partnerHouseType as string}
                touched={!!touched.partnerHouseType}
              />

              <FormTextInput
                label="Gold (in grams)"
                value={values.partnerGold}
                onChangeText={handleChange("partnerGold")}
                onBlur={handleBlur("partnerGold")}
                error={errors.partnerGold as string}
                touched={!!touched.partnerGold}
              />

              <Dropdown
                label="Skin Color"
                value={values.partnerSkinColor}
                onValueChange={(val) => setFieldValue("partnerSkinColor", val)}
                options={skinColorOptions}
                error={errors.partnerSkinColor as string}
                touched={!!touched.partnerSkinColor}
              />

              <MultiDropdown
                label="Star Multi"
                selectedValues={values.partnerStarMulti || []}
                onValuesChange={(val) => setFieldValue("partnerStarMulti", val)}
                options={starOptions}
                error={errors.partnerStarMulti as string[] | undefined}
                touched={!!touched.partnerStarMulti}
              />

              <MultiDropdown
                label="Rasi Multi"
                selectedValues={values.partnerRasiMulti || []}
                onValuesChange={(val) => setFieldValue("partnerRasiMulti", val)}
                options={starOptions}
                error={errors.partnerRasiMulti as string[] | undefined}
                touched={!!touched.partnerRasiMulti}
              />

              {/* Fill Test Data */}
              <TouchableOpacity
                style={styles.fillButton}
                onPress={() => {
                  setFieldValue("partnerName", "John Doe");
                  setFieldValue("partnerAgeFrom", "25");
                  setFieldValue("partnerAgeTo", "30");
                  setFieldValue("partnerMaritalStatus", "single");
                  setFieldValue("partnerHometown", "madurai");
                  setFieldValue("partnerJobTown", ["chennai"]);
                  setFieldValue("partnerReligion", "hindu");
                  setFieldValue("partnerSubcaste", "iyer");
                  setFieldValue("partnerEducation", "bachelors");
                  setFieldValue("partnerJob", "engineer");
                  setFieldValue("partnerSalary", "50000");
                  setFieldValue("partnerStar", "ashwini");
                  setFieldValue("partnerHometownMulti", ["madurai"]);
                  setFieldValue("partnerChevai", "no");
                  setFieldValue("partnerPhysicalChallenge", "no");
                  setFieldValue("partnerHouseType", "apartment");
                  setFieldValue("partnerGold", "50");
                  setFieldValue("partnerSkinColor", "fair");
                  setFieldValue("partnerStarMulti", ["ashwini"]);
                  setFieldValue("partnerRasiMulti", ["ashwini"]);
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
