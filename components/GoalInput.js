import { useState } from 'react';
import {View, Text, Button, TextInput, ScrollView, FlatList, Modal} from 'react-native';
import { StyleSheet } from 'react-native';
function GoalInput (props)
{

const [goalText, setGoalText] = useState('');
  function goalInputHandler(g)
  {
setGoalText(g);
  }

  function addGoalHandler()
  {
props.onAddGoal(goalText);
props.onClose();
  }

  

       return (
    <Modal visible={props.visible} animationType='slide'>
          <View style={styles.inputBox}>
           <TextInput value= {goalText} onChangeText={goalInputHandler} style={styles.txts} placeholder='enter texts'></TextInput>
      <Button style={styles.btns} onPress={addGoalHandler} title='click'/>
      <Button title='cancel' onPress={props.onClose}/>
      </View>
    </Modal>
       )
}


const styles = StyleSheet.create({
    inputBox: 
    {
        width: '100%',
    },
  txts: {
    height : 50,
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 20,
  },


});
 export default GoalInput;
