import { useState, PropsWithChildren } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
// Assuming you are in an environment where @expo/vector-icons is available
import { Ionicons } from "@expo/vector-icons";


// --- Non-compulsory code removed: 'React.FC' and manual 'children' definition ---

// Enable LayoutAnimation for Android
// This section is compulsory for smooth animation on Android devices.
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 1. Define only the custom props needed for the component.
interface CollapseProps {
  title: string; // The required title text
}

type Props = PropsWithChildren<CollapseProps>;

// 3. Use standard function component syntax for clean typing
const Collapse = ({ title, children }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header} activeOpacity={0.8}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="#333"
        />
      </TouchableOpacity>
      {/* Conditionally render the body when expanded is true */}
      {expanded && <View style={styles.body}>{children}</View>}
    </View>
  );
};

export default Collapse;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12, // Slightly more rounded corners for modern look
    overflow: "hidden",
    backgroundColor: "#fafafa", // Light background for contrast
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Use transparent unless expanded
  },
  title: {
    fontSize: 18, // Slightly larger font
    fontWeight: "600", // Semi-bold
    color: "#333",
  },
  body: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: "#f9f9f9",
  },
});
