import { StyleSheet, Text, View, Dimensions, TextInput, Image} from 'react-native'
import React, { useState } from 'react'

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

export const Cimage = ({item, setChoice, choice}) => {
    const [text, setText] = useState('')

    const changeText = (e) => {
        setText(e);
        // console.log(e);
        var newChoice = choice;
        newChoice[item.id].user_answer = e;
        setChoice(newChoice)
        // console.log('choice a', choice[item.id]);
    }

    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                <Image style={{width: 200, height: 200}} source={item.url}/>
                <TextInput style={styles.input} value={text} onChangeText={changeText}></TextInput>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: width * 0.9,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
  },
});