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
