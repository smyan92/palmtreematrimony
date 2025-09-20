// import React, { useState } from 'react';
// import { StyleSheet, View, FlatList, Button } from 'react-native';
// import GoalsLists from '../../components/Goals';
// import GoalInput from '../../components/GoalInput';

// export default function HomeScreen() {
//   const [goals, setGoals] = useState<string[]>([]);
//   const [isModalShow, setisModalShow]=useState(false);

//   function addGoalHandler(goalText: string) {
//     setGoals((currentGoals) => [...currentGoals, goalText]);
//   }

//   function deleteItem(index: number) {
//     const newGoals = goals.filter((_, i) => i !== index);
//     setGoals(newGoals);
//   }
//   function startAddGoalHandler()
//   {
//     setisModalShow(true);
//   }
//     function closeGoalHandler()
//   {
//     setisModalShow(false);
//   }


//   return (
//     <View style={styles.container}>


//       <Button title='add new goals' color="red" onPress={startAddGoalHandler} />
//  <GoalInput visible={isModalShow} onClose={closeGoalHandler} onAddGoal={addGoalHandler} />

//       <FlatList
//         data={goals}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item, index }) => (
//           <GoalsLists text={item} onDelete={() => deleteItem(index)} />
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'grey',
//     padding: 50,
//     paddingTop: 200,
//     width: '100%',
//     height: '100%',
//   },
//   box: {
//     width: '100%',
//     height: '70%',
//   },
// });
