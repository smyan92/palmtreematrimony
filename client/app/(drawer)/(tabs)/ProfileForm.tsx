import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  LayoutAnimation,
  UIManager,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import PhotoUpload from "@/components/photoUpload"; // Import componen
// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ===================================================================
// 1. DATA AND CONSTANTS (Madurai-focused Tamil Matrimony Data)
// ===================================================================

const TAMIL_DROPDOWN_DATA = {
  // --- Profile Details ---

HOMETOWN: [
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
],


  RELIGION: [
    { label: "Hindu", value: "Hindu" },
    { label: "Christian", value: "Christian" },
    { label: "Muslim", value: "Muslim" },
    { label: "Jain", value: "Jain" },
    { label: "Other", value: "Other" },
  ],
  // Common Tamil Subcastes
SUBCASTE: [
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
],


  // Major Rasi options
  RASI: [
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
  ],
  // Major Nakshatra/Star options
  STAR: [
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
  ],
  COMPLEXION: [
    { label: "Very Fair", value: "Very Fair" },
    { label: "Fair", value: "Fair" },
    { label: "Wheatish", value: "Wheatish" },
    { label: "Dark", value: "Dark" },
  ],
HEIGHT: [
  { label: "2' 0\" - 61 cm", value: "2' 0\"" },
  { label: "2' 3\" - 69 cm", value: "2' 3\"" },
  { label: "2' 6\" - 76 cm", value: "2' 6\"" },
  { label: "2' 9\" - 84 cm", value: "2' 9\"" },
  { label: "3' 0\" - 91 cm", value: "3' 0\"" },
  { label: "3' 3\" - 99 cm", value: "3' 3\"" },
  { label: "3' 6\" - 107 cm", value: "3' 6\"" },
  { label: "3' 9\" - 114 cm", value: "3' 9\"" },
  { label: "4' 0\" - 122 cm", value: "4' 0\"" },
  { label: "4' 3\" - 130 cm", value: "4' 3\"" },
  { label: "4' 6\" - 137 cm", value: "4' 6\"" },
  { label: "4' 9\" - 145 cm", value: "4' 9\"" },
  { label: "5' 0\" - 152 cm", value: "5' 0\"" },
  { label: "5' 3\" - 160 cm", value: "5' 3\"" },
  { label: "5' 6\" - 168 cm", value: "5' 6\"" },
  { label: "5' 9\" - 175 cm", value: "5' 9\"" },
  { label: "6' 0\" - 183 cm", value: "6' 0\"" },
  { label: "6' 3\" - 191 cm", value: "6' 3\"" },
  { label: "6' 6\" - 198 cm", value: "6' 6\"" },
  { label: "6' 9\" - 206 cm", value: "6' 9\"" },
  { label: "7' 0\" - 213 cm", value: "7' 0\"" },
  { label: "7' 3\" - 221 cm", value: "7' 3\"" },
  { label: "7' 6\" - 229 cm", value: "7' 6\"" },
  { label: "7' 9\" - 236 cm", value: "7' 9\"" },
  { label: "8' 0\" - 244 cm", value: "8' 0\"" },
  { label: "8' 3\" - 252 cm", value: "8' 3\"" },
  { label: "8' 6\" - 259 cm", value: "8' 6\"" },
  { label: "8' 9\" - 267 cm", value: "8' 9\"" },
  { label: "8' 11\" - 272 cm", value: "8' 11\"" }, // Tallest recorded
],

  FOOD: [
    { label: "Vegetarian", value: "Veg" },
    { label: "Non-Vegetarian", value: "Non-Veg" },
    { label: "Eggetarian", value: "Egg" },
  ],
MOTHER_TONGUE: [
  // South Indian core
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
  { label: "Sinhala", value: "Sinhala" },     // Sri Lanka
  { label: "English (Sri Lankan)", value: "English (Sri Lankan)" },

  // Worldwide migration (common languages spoken by diaspora Nadars)
  { label: "English", value: "English" },
  { label: "French", value: "French" },       // France, Canada
  { label: "German", value: "German" },       // Germany
  { label: "Dutch", value: "Dutch" },         // Netherlands
  { label: "Spanish", value: "Spanish" },     // Spain, Latin America, US
  { label: "Arabic", value: "Arabic" },       // Middle East (UAE, Saudi, Qatar, etc.)
  { label: "Malay", value: "Malay" },         // Malaysia, Singapore
  { label: "Chinese (Mandarin)", value: "Chinese (Mandarin)" },
  { label: "Chinese (Cantonese)", value: "Chinese (Cantonese)" },
  { label: "Thai", value: "Thai" },
],

  CHEVVAI_DHOSAM: [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Slight", value: "Slight" },
    { label: "Don't Know", value: "Don't Know" },
  ],
  PHYSICAL_CHALLENGE: [
    { label: "None", value: "None" },
    { label: "Physically Challenged", value: "Yes" },
  ],
  // --- Professional & Education ---
  EDUCATION: [
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
],

 JOB: [
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
  // You can continue adding more jobs here
],

  // Standardised Salary Ranges (in Lakhs Per Annum - L.P.A)
  SALARY_LPA: [
    { label: "Upto ₹2 Lakhs", value: "0-2L" },
    { label: "₹2 Lakhs - ₹5 Lakhs", value: "2L-5L" },
    { label: "₹5 Lakhs - ₹10 Lakhs", value: "5L-10L" },
    { label: "₹10 Lakhs - ₹20 Lakhs", value: "10L-20L" },
    { label: "₹20 Lakhs and above", value: "20L+" },
  ],
  // --- Family Details ---
  HOUSE_TYPE: [
    { label: "Own House", value: "Own" },
    { label: "Rented House", value: "Rented" },
    { label: "Lease", value: "Lease" },
  ],
  YES_NO: [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ],
  // --- Habits ---
  HABITS: [
    { label: "No", value: "No" },
    { label: "Occasionally", value: "Occasionally" },
    { label: "Regularly", value: "Regularly" },
  ],
  // --- Partner Preference ---
  PARTNER_AGE: [
    { label: "18 - 25", value: "18-25" },
    { label: "25 - 30", value: "25-30" },
    { label: "30 - 35", value: "30-35" },
    { label: "35+", value: "35+" },
  ],
  PARTNER_MARITAL_STATUS: [
    { label: "Never Married", value: "Never Married" },
    { label: "Divorced", value: "Divorced" },
    { label: "Widowed", value: "Widowed" },
  ],
};

// ===================================================================
// 2. INTERFACES AND INITIAL VALUES
// ===================================================================

interface ProfileFormValues {
  // Step 1: Basic Details
  name: string;
  dob: Date; // Use Date object for date picker
  birthTime: Date; // Use Date object for time picker
  homeTown: string;
  jobTown: string;
  religion: string;
  subCaste: string;
  rasi: string;
  star: string;
  color: string;
  height: string;
  weight: string;
  salry: string;
  food: string;
  motherTongue: string;
  chevvaiDhosam: string;
  goldPown: string; // Gold is typically in 'Pown' in Tamil Nadu
  physicalChallenge: string;
  photos: string[];

  // Step 2: Professional & Education
  salary: string;
  jobPlace: string;
  education: string;
  job: string;
  // Step 3: Family Details
  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  houseType: string;
  loan: string;
  loanAmount: string;
  olderBrothers: string;
  elderBrothers: string;
  olderSisters: string;
  elderSisters: string;
  propertyDetails: string;
  ownCar: string;
  marriedBrothers: number;
  unmarriedBrothers: number;
  marriedSisters: number;
  unmarriedSisters: number;
  smoking: string;
  drinking: string;

  // Step 4: Contact Details
  mobile: string;
  altNumber: string;
  email: string;

  // Step 5: Partner Preference
  partnerAge: string;
  partnerHeight: string;
  partnerMaritalStatus: string;
  partnerPhysicalStatus: string;
  partnerMotherTongue: string;
  partnerHometown: string;
  partnerJobtown: string;
  partnerReligion: string;
  partnerSubCaste: string;
  partnerChevvaiDhosam: string;
  partnerEducation: string;
  partnerJob: string;
  partnerSalary: string;
  partnerCountry: string;
  partnerEatingHabits: string;
  partnerDrinkingHabit: string;
  partnerSmokingHabit: string;
  partnerColor: string;
  partnerGoldPown: string;
  partnerContact: string;
}

const initialValues: ProfileFormValues = {
  // Step 1
  name: "",
  dob: new Date(),
  birthTime: new Date(new Date().setHours(12, 0, 0, 0)), // Default to noon for time
  homeTown: "string", // Pre-filled as per user request
  jobTown: "string", // Pre-filled as per user request
  religion: "string",
  subCaste: "",
  rasi: "",
  star: "",
  color: "",
  height: "",
  weight: "",
  salry: "string",
  food: "Vegetarian",
  motherTongue: "Tamil",
  chevvaiDhosam: "No",
  goldPown: "",
  physicalChallenge: "None",
  photos: [],

  // Step 2
  salary: "",
  jobPlace: "Madurai",
  education: "",
  job: "",
  // Step 3
  fatherName: "",
  fatherJob: "",
  motherName: "",
  motherJob: "",
  houseType: "Own House",
  loan: "No",
  loanAmount: "0",
    olderBrothers: "",
  elderBrothers: "",
  olderSisters: "",
  elderSisters: "",
  propertyDetails: "",
  ownCar: "No",
  marriedBrothers: 0,
  unmarriedBrothers: 0,
  marriedSisters: 0,
  unmarriedSisters: 0,
  smoking: "No",
  drinking: "No",

  // Step 4
  mobile: "",
  altNumber: "",
  email: "",

  // Step 5
  partnerAge: "25 - 30",
  partnerHeight: "5' 3\" - 160 cm",
  partnerMaritalStatus: "Never Married",
  partnerPhysicalStatus: "None",
  partnerMotherTongue: "Tamil",
  partnerHometown: "madurai",
  partnerJobtown: "madurai",
  partnerReligion: "Hindu",
  partnerSubCaste: "Iyer",
  partnerChevvaiDhosam: "No",
  partnerEducation: "B.E. / B.Tech",
  partnerJob: "Software Engineer",
  partnerSalary: "5 Lakhs - 10 Lakhs",
  partnerCountry: "India",
  partnerEatingHabits: "Vegetarian",
  partnerDrinkingHabit: "No",
  partnerSmokingHabit: "No",
  partnerColor: "Fair",
  partnerGoldPown: "5",
  partnerContact: "Parents",
};

// ===================================================================
// 3. VALIDATION SCHEMAS
// ===================================================================

const baseSchema = {
    name: Yup.string().required("Name is required"),
    homeTown: Yup.string().required("Home Town is required"),
    jobTown: Yup.string().required("Job Town is required"),
    religion: Yup.string().required("Religion is required"),
    subCaste: Yup.string().required("Sub-Caste is required"),
};

const validationSchemas = [
  // Step 1: Basic Details
  Yup.object().shape({
    ...baseSchema,
    rasi: Yup.string().required("Rasi is required"),
    star: Yup.string().required("Star is required"),
    height: Yup.string().required("Height is required"),
    weight: Yup.string().required("Weight is required"),
  }),
  // Step 2: Professional & Education
  Yup.object().shape({
    education: Yup.string().required("Highest Education is required"),
    job: Yup.string().required("Job Title is required"),
       salary: Yup.string().required("salary is required"),
    jobPlace: Yup.string().required("Work Place is required"),
  }),
  // Step 3: Family Details
  Yup.object().shape({
    fatherName: Yup.string().required("Father's Name is required"),
    motherName: Yup.string().required("Mother's Name is required"),
    houseType: Yup.string().required("House Type is required"),
    marriedBrothers: Yup.number().min(0, "Cannot be negative"),
    unmarriedBrothers: Yup.number().min(0, "Cannot be negative"),
      ownCar: Yup.string().required('Please select if you own a car'),
  }),
  // Step 4: Contact Details
  Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
         photos: Yup.array()
    .min(1, "Please upload at least 1 photo")
    .max(3, "You can upload up to 3 photos"),
  }),
  // Step 5: Partner Preference (No validation for simplicity, but can be added)
  Yup.object().shape({
    partnerAge: Yup.string().required("Preferred age is required"),
  }),
];

// ===================================================================
// 4. HELPER COMPONENTS
// ===================================================================

const steps = [
  "1. Basic & Horoscope Details",
  "2. Professional & Education",
  "3. Family Details",
  "4. Contact Details",
  "5. Partner Preference",
];const ErrorText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.errorText}>{children}</Text>
);

interface DropdownProps {
  label: string;
  name: keyof ProfileFormValues;
  formik: any; // Use a proper type if you can, but 'any' is common for quick Formik usage
  items: ItemType<string>[];
  zIndex?: number;
}

const CustomDropdown: React.FC<DropdownProps> = ({ label, name, formik, items, zIndex = 1 }) => {
  const [open, setOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState<ItemType<string>[]>(items);

  const value = formik.values[name];

  return (
 <View style={[styles.dropdownContainer, { zIndex }]}>
  <Text style={styles.label}>{label}</Text>
  <DropDownPicker
    open={open}
    value={value}
    items={dropdownItems}
    setOpen={setOpen}
    setItems={setDropdownItems}  // ✅ required
    setValue={(callback) => {
      const val = typeof callback === "function" ? callback(value) : callback;
      formik.setFieldValue(name, val);
    }}                             // ✅ required for single select
    multiple={false}              // ✅ single selection
    placeholder={`Select ${label}`}
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownMenu}
  />
  {formik.touched[name] && formik.errors[name] && (
    <ErrorText>{formik.errors[name] as string}</ErrorText>
  )}
</View>

  );
};



// ===================================================================
// 5. MAIN FORM COMPONENT
// ===================================================================

export default function ProfileForm() {
  const [expandedStep, setExpandedStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentPickerTarget, setCurrentPickerTarget] = useState<"dob" | "birthTime" | null>(null);

  const toggleStep = (stepId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedStep(expandedStep === stepId ? 0 : stepId);
  };
  
  const showPicker = (target: "dob" | "birthTime", initialDate: Date) => {
    setCurrentPickerTarget(target);
    if (Platform.OS === 'web') {
      Alert.alert("Native Picker Only", "Date/Time picker dialogs are only visible on a mobile device (iOS/Android).");
      return;
    }
    if (target === "dob") {
      setShowDatePicker(true);
    } else if (target === "birthTime") {
      setShowTimePicker(true);
    }
  };

  const onFormSubmit = async (values: ProfileFormValues, actions: FormikHelpers<ProfileFormValues>) => {
    // 1. Validate the final step
    try {
      await validationSchemas[4].validate(values, { abortEarly: false });
    } catch (err) {
      // If validation fails, navigate to the error step
      Alert.alert("Validation Error", "Please fill all required fields in Step 5.");
      setExpandedStep(5);
      actions.setSubmitting(false);
      return;
    }
    
    // 2. Final Submission Logic
    console.log("--- FINAL FORM DATA ---");
    console.log("Name:", values.name);
    console.log("DOB:", values.dob.toLocaleDateString('en-IN'));
    console.log("Birth Time:", values.birthTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    console.log("Home Town:", values.homeTown);
    console.log("Job Town:", values.jobTown);
    console.log("Sub-Caste:", values.subCaste);
    console.log("Salary:", values.salary);
    console.log("---");
    
    Alert.alert(
      "Profile Submission Successful!",
      "Your profile data has been successfully collected. (Check console for full data)"
    );

    actions.setSubmitting(false);
    // navigation.navigate('SuccessScreen'); // Example navigation
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Madurai Matrimony Profile</Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas[expandedStep - 1] || Yup.object().shape({})}
        onSubmit={onFormSubmit}
        enableReinitialize={true} // Re-validate on step change
      >
        {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, touched, errors, isSubmitting }) => {
          
          // Shared handler for both date and time selection
          const onDateTimeChange = (event: any, selectedDate?: Date) => {
            setShowDatePicker(false);
            setShowTimePicker(false);
            
            if (event.type === 'set' && selectedDate) { // 'set' action on Android/iOS
              if (currentPickerTarget === "dob") {
                setFieldValue("dob", selectedDate);
              } else if (currentPickerTarget === "birthTime") {
                setFieldValue("birthTime", selectedDate);
              }
            }
            setCurrentPickerTarget(null);
          };
          
          const validateAndAdvance = async () => {
            const currentSchema = validationSchemas[expandedStep - 1];
            try {
              await currentSchema.validate(values, { abortEarly: false });
              if (expandedStep < steps.length) {
                toggleStep(expandedStep + 1);
              } else {
                handleSubmit();
              }
            } catch (err) {
              Alert.alert("Error", "Please fill all required fields correctly before proceeding.");
              // Formik's internal validation will populate the error messages
            }
          };

          return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
              
              {/* --- DATE/TIME PICKER MODAL --- */}
              {showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={values.dob as Date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateTimeChange}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  testID="timePicker"
                  value={values.birthTime as Date}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateTimeChange}
                  is24Hour={true}
                />
              )}
              {/* --- END DATE/TIME PICKER --- */}

              {steps.map((label, stepId) => (
                <View key={stepId} style={{ zIndex: steps.length - stepId }}>
                  <TouchableOpacity
                    style={styles.stepHeader}
                    onPress={() => toggleStep(stepId + 1)}
                  >
                    <Text style={styles.stepHeaderText}>{label}</Text>
                    <Ionicons
                      name={expandedStep === stepId + 1 ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#006400"
                    />
                  </TouchableOpacity>

                  {expandedStep === stepId + 1 && (
                    <View style={styles.stepContent}>
                      {/* ==================================== */}
                      {/* STEP 1: Basic & Horoscope Details */}
                      {/* ==================================== */}
                      {stepId === 0 && (
                        <>
                          {/* Name */}
                              <Text style={styles.label}>Full Name</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                          />
                          {touched.name && errors.name && <ErrorText>{errors.name}</ErrorText>}

                          {/* DOB - Date Picker Trigger */}
                          <TouchableOpacity 
                            style={styles.input} 
                            onPress={() => showPicker("dob", values.dob as Date)}
                          >
                              <Text style={styles.label}>Date of Birth</Text>
                            <Text style={values.dob ? styles.pickerText : styles.placeholderText}>
                              {values.dob ? `DOB: ${values.dob.toLocaleDateString('en-IN')}` : "Date of Birth (DOB) *"}
                            </Text>
                          </TouchableOpacity>
                          {/* Birth Time - Time Picker Trigger */}

                              <Text style={styles.label}>Time of Birth</Text>

                          <TouchableOpacity 
                            style={styles.input} 
                            onPress={() => showPicker("birthTime", values.birthTime as Date)}
                          >
                            <Text style={values.birthTime ? styles.pickerText : styles.placeholderText}>
                              {values.birthTime ? `Birth Time: ${values.birthTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : "Birth Time *"}
                            </Text>
                          </TouchableOpacity>
                          
                          <CustomDropdown label="homeTown *" name="homeTown" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HOMETOWN} zIndex={11} />
                          <CustomDropdown label="Religion *" name="religion" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.RELIGION} zIndex={10} />
                          <CustomDropdown label="Sub-Caste *" name="subCaste" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.SUBCASTE} zIndex={9} />
                          <CustomDropdown label="Rasi (Moon Sign) *" name="rasi" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.RASI} zIndex={8} />
                          <CustomDropdown label="Star / Nakshatra *" name="star" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.STAR} zIndex={7} />
                          <CustomDropdown label="Complexion *" name="color" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.COMPLEXION} zIndex={6} />
                          <CustomDropdown label="Height *" name="height" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HEIGHT} zIndex={5} />
                              <Text style={styles.label}>Weight in (kg)</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Weight (in kg)"
                            keyboardType="numeric"
                            onChangeText={handleChange('weight')}
                            onBlur={handleBlur('weight')}
                            value={values.weight}
                          />
                          {touched.weight && errors.weight && <ErrorText>{errors.weight}</ErrorText>}

                          <CustomDropdown label="Food Habits *" name="food" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.FOOD} zIndex={4} />
                          <CustomDropdown label="Mother Tongue *" name="motherTongue" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.MOTHER_TONGUE} zIndex={3} />
                          <CustomDropdown label="Chevvai Dhosam *" name="chevvaiDhosam" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.CHEVVAI_DHOSAM} zIndex={2} />
                              <Text style={styles.label}>Weight in (pown)</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Gold (Pown)"
                            keyboardType="numeric"
                            onChangeText={handleChange('goldPown')}
                            onBlur={handleBlur('goldPown')}
                            value={values.goldPown}
                          />

                          <CustomDropdown label="Physical Challenge *" name="physicalChallenge" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.PHYSICAL_CHALLENGE} zIndex={1} />
                        </>
                      )}

                      {/* ==================================== */}
                      {/* STEP 2: Professional & Education */}
                      {/* ==================================== */}
                      {stepId === 1 && (
                        <>
                          <CustomDropdown label="Highest Education *" name="education" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.EDUCATION} zIndex={5} />
                          <CustomDropdown label="JobTitle *" name="job" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.JOB} zIndex={4} />
                           <Text style={styles.label}>Monthly Salary</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Monthly Salary (in Rs)"
                            keyboardType="numeric"
                            onChangeText={handleChange('salary')}
                            onBlur={handleBlur('salary')}
                            value={values.salary}
                          />
                          {touched.salary && errors.salary && <ErrorText>{errors.salary}</ErrorText>}
                          <CustomDropdown label="jobTown *" name="jobTown" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HOMETOWN} zIndex={11} />


                        </>
                      )}

                      {/* ==================================== */}
                      {/* STEP 3: Family Details */}
                      {/* ==================================== */}
                      {stepId === 2 && (
                        <>
                              <Text style={styles.label}>Father Name</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Father's Name *"
                            onChangeText={handleChange('fatherName')}
                            onBlur={handleBlur('fatherName')}
                            value={values.fatherName}
                          />
                          {touched.fatherName && errors.fatherName && <ErrorText>{errors.fatherName}</ErrorText>}
                          <CustomDropdown label="Father JobTitle *" name="fatherJob" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.JOB} zIndex={4} />
                              <Text style={styles.label}>Mother Name</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Mother's Name *"
                            onChangeText={handleChange('motherName')}
                            onBlur={handleBlur('motherName')}
                            value={values.motherName}
                          />
                          {touched.motherName && errors.motherName && <ErrorText>{errors.motherName}</ErrorText>}
                          <CustomDropdown label="Mother JobTitle *" name="motherJob" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.JOB} zIndex={4} />
                              <TextInput
                            style={styles.input}
                            placeholder="older brother count"
                            onChangeText={handleChange('olderBrothers')}
                              keyboardType="numeric"
                            onBlur={handleBlur('olderBrothers')}
                            value={values.olderBrothers}
                          />

                                      <TextInput
                            style={styles.input}
                            placeholder="elder brother count"
                            onChangeText={handleChange('elderBrothers')}
                              keyboardType="numeric"
                            onBlur={handleBlur('elderBrothers')}
                            value={values.elderBrothers}
                          />

                                        <TextInput
                            style={styles.input}
                            placeholder="older sister count"
                            onChangeText={handleChange('olderSisters')}
                              keyboardType="numeric"
                            onBlur={handleBlur('olderSisters')}
                            value={values.olderSisters}
                          />

                       <TextInput
                            style={styles.input}
                            placeholder="elder sister count"
                            onChangeText={handleChange('elderSisters')}
                              keyboardType="numeric"
                            onBlur={handleBlur('elderSisters')}
                            value={values.elderSisters}
                          />

                          <CustomDropdown label="House Type *" name="houseType" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HOUSE_TYPE} zIndex={4} />
                          <CustomDropdown label="Family Loan? *" name="loan" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.YES_NO} zIndex={3} />
                              <Text style={styles.label}>Monthly Loan Amount</Text>
                     
                     
                          <TextInput
                            style={styles.input}
                            placeholder="Loan Amount Monthly(Rs)"
                            onChangeText={handleChange('loanAmount')}
                            onBlur={handleBlur('loanAmount')}
                              keyboardType="numeric"
                            value={values.loanAmount}
                          />

<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
  <Text style={styles.label}>Own Car</Text>
  <Switch
    value={values.ownCar === 'Yes'}
    onValueChange={(val: boolean) => {
      setFieldValue('ownCar', val ? 'Yes' : 'No');
    }}
  />
</View>

                              <Text style={styles.label}>Property Details</Text>
              <TextInput
  style={[styles.input, { height: 100, textAlignVertical: 'top' }]} // adjust height as needed
  placeholder="Property Details"
  onChangeText={handleChange('propertyDetails')}
  onBlur={handleBlur('propertyDetails')}
  value={values.propertyDetails}
  multiline={true}
  numberOfLines={5} // optional: shows 5 lines by default
/>


                          <CustomDropdown label="Smoking Habit" name="smoking" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HABITS} zIndex={2} />
                          <CustomDropdown label="Drinking Habit" name="drinking" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HABITS} zIndex={1} />
                        </>
                      )}

                      {/* ==================================== */}
                      {/* STEP 4: Contact Details */}
                      {/* ==================================== */}
                      {stepId === 3 && (
                        <>
                          <TextInput
                            style={styles.input}
                            placeholder="Mobile Number *"
                            keyboardType="phone-pad"
                            onChangeText={handleChange('mobile')}
                            onBlur={handleBlur('mobile')}
                            value={values.mobile}
                          />
                          {touched.mobile && errors.mobile && <ErrorText>{errors.mobile}</ErrorText>}

                          <TextInput
                            style={styles.input}
                            placeholder="Alternate Number"
                            keyboardType="phone-pad"
                            onChangeText={handleChange('altNumber')}
                            onBlur={handleBlur('altNumber')}
                            value={values.altNumber}
                          />

                             <PhotoUpload
              photos={values.photos}
              setPhotos={(photos) => setFieldValue("photos", photos)}
            />
            {errors.photos && <Text style={styles.errorText}>{errors.photos}</Text>}
                        </>
                      )}

                      {/* ==================================== */}
                      {/* STEP 5: Partner Preference */}
                      {/* ==================================== */}
                      {stepId === 4 && (
                        <>
                          <Text style={styles.preferenceTitle}>Desired Partner Attributes</Text>
                          <CustomDropdown label="Age Range" name="partnerAge" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.PARTNER_AGE} zIndex={11} />
                          <CustomDropdown label="Marital Status" name="partnerMaritalStatus" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.PARTNER_MARITAL_STATUS} zIndex={10} />
                          <CustomDropdown label="homeTown" name="partnerHometown" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HOMETOWN} zIndex={9} />
                          <CustomDropdown label="jobTown" name="partnerJobtown" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.HOMETOWN} zIndex={9} />
                          <CustomDropdown label="Religion" name="partnerReligion" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.RELIGION} zIndex={8} />
                          <CustomDropdown label="Sub-Caste" name="partnerSubCaste" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.SUBCASTE} zIndex={7} />
                          <CustomDropdown label="Education" name="partnerEducation" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.EDUCATION} zIndex={6} />
                          <CustomDropdown label="job" name="partnerJob" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.JOB} zIndex={6} />
                          <CustomDropdown label="Annual Salary (LPA)" name="partnerSalary" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.SALARY_LPA} zIndex={5} />
                          <CustomDropdown label="Chevvai Dhosam" name="partnerChevvaiDhosam" formik={{ values, setFieldValue, touched, errors }} items={TAMIL_DROPDOWN_DATA.CHEVVAI_DHOSAM} zIndex={4} />
                          <TextInput style={styles.input} placeholder="Contact Via (e.g., Parents, Self)" onChangeText={handleChange('partnerContact')} value={values.partnerContact} />
                        </>
                      )}

                      {/* Next/Save Button */}
                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={validateAndAdvance}
                        disabled={isSubmitting}
                      >
                        <Text style={styles.nextButtonText}>
                          {stepId === steps.length - 1 ? (isSubmitting ? "Submitting..." : "Save Profile") : "Next Step"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}

              <View style={{ height: 50 }} />
            </ScrollView>
          );
        }}
      </Formik>
    </View>
  );
}

// ===================================================================
// 6. STYLES
// ===================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#006400', // Dark Green
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  contentContainer: {
    paddingBottom: 30,
    paddingTop: 10,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6ffe6', // Light Green
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#006400',
  },
  stepHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006400',
  },
  stepContent: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  // --- Input Styles ---
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center', // for text in TouchableOpacity
  },
  pickerText: {
    color: '#333',
    fontSize: 14,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
    marginTop: -10,
  },
  // --- Dropdown Styles ---
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    height: 50,
  },
  dropdownMenu: {
    borderColor: '#ccc',
  },
  // --- Button Styles ---
  nextButton: {
    backgroundColor: '#FF4500', // Orange-Red for action
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  siblingLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 5,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  }
  
});