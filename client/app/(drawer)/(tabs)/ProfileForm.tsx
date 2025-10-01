import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomHeader from "@/components/customHeader/CustomHeader"

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Step {
  id: number;
  label: string;
}

export default function ProfileForm({ navigation }: any) {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const steps: Step[] = [
    { id: 1, label: "Basic Details" },
    { id: 2, label: "Professional Details" },
    { id: 3, label: "Family Details" },
    { id: 4, label: "Contact Details" },
    { id: 5, label: "Partner Preferences" },
  ];

  const toggleStep = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedStep(expandedStep === id ? null : id);
  };

  /*** Dropdowns ***/
  const [homeTownOpen, setHomeTownOpen] = useState(false);
  const [homeTownItems, setHomeTownItems] = useState([
    { label: "Madurai", value: "madurai" },
    { label: "Chennai", value: "chennai" },
  ]);

  const [jobOpen, setJobOpen] = useState(false);
  const [jobItems, setJobItems] = useState([
    { label: "Engineer", value: "engineer" },
    { label: "Doctor", value: "doctor" },
  ]);

  /*** Formik schema ***/
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    homeTown: Yup.string().required("Select Home Town"),
    job: Yup.string().required("Select Job"),
  });

  return (
        <View style={{ flex: 1 }}>
       <CustomHeader title="complete your Profile" showBackButton />

    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Complete Your Profile</Text>

      {steps.map((step) => (
        <View key={step.id}>
          {/* Step Header */}
          <TouchableOpacity style={styles.stepHeader} onPress={() => toggleStep(step.id)}>
            <Text style={styles.stepLabel}>{step.label}</Text>
            <Ionicons
              name={expandedStep === step.id ? "chevron-up" : "chevron-down"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          {/* Step Content */}
          {expandedStep === step.id && (
            <View style={styles.stepContent}>
              <Formik
                initialValues={{
                  name: "",
                  homeTown: "",
                  job: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  console.log("Saved Values:", values);
                  if (step.id < steps.length) {
                    setExpandedStep(step.id + 1); // auto expand next step
                  } else {
                    alert("Profile Completed!");
                    navigation.goBack();
                  }
                }}
              >
                {({ handleChange, setFieldValue, handleSubmit, values, errors, touched }) => (
                  <>
                    {step.id === 1 && (
                      <>
                        <TextInput
                          style={styles.input}
                          placeholder="Name"
                          value={values.name}
                          onChangeText={handleChange("name")}
                        />
                        {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                        <DropDownPicker
                          open={homeTownOpen}
                          value={values.homeTown}
                          items={homeTownItems}
                          setOpen={setHomeTownOpen}
                          setValue={(val) => setFieldValue("homeTown", val())}
                          setItems={setHomeTownItems}
                          placeholder="Home Town"
                          style={{ marginTop: 10 }}
                        />
                        {touched.homeTown && errors.homeTown && (
                          <Text style={styles.error}>{errors.homeTown}</Text>
                        )}
                      </>
                    )}

                    {step.id === 2 && (
                      <DropDownPicker
                        open={jobOpen}
                        value={values.job}
                        items={jobItems}
                        setOpen={setJobOpen}
                        setValue={(val) => setFieldValue("job", val())}
                        setItems={setJobItems}
                        placeholder="Job"
                      />
                    )}

                    <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  stepLabel: { fontSize: 16, fontWeight: "600" },
  stepContent: { paddingVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  error: { color: "red", marginBottom: 8 },
  saveButton: {
    backgroundColor: "#F18221",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
});
