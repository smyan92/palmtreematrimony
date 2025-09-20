import { View, Text, Pressable, StyleSheet } from 'react-native';

function Goals(props) {
  return (
    <Pressable onPress={props.onDelete} android_ripple={{ color: '#dddddd' }}>
      <View style={styles.listss}>
        <Text style={styles.list}>{props.text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listss: {
    backgroundColor: 'blue',        // ✅ moved from Text to View
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',             // ✅ needed for ripple to be visible
  },
  list: {
    fontSize: 30,
    color: 'white',
    padding: 10,                    // ✅ better touch area
  },
});

export default Goals;
