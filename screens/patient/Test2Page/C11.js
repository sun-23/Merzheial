import { StyleSheet, Text, View, Dimensions, TextInput} from 'react-native'
import React, { useState } from 'react'

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

export const C11 = ({item, setChoice, choice}) => {
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [text3, setText3] = useState('')
    const [text4, setText4] = useState('')
    const [text5, setText5] = useState('')

    const changeText1 = (e) => {
        setText1(e);
        var newChoice = choice;
        newChoice[item.id].ans1 = e;
        setChoice(newChoice)
    }

    const changeText2 = (e) => {
        setText2(e);
        var newChoice = choice;
        newChoice[item.id].ans2 = e;
        setChoice(newChoice)
    }

    const changeText3 = (e) => {
        setText3(e);
        var newChoice = choice;
        newChoice[item.id].ans3 = e;
        setChoice(newChoice)
    }

    const changeText4 = (e) => {
        setText4(e);
        var newChoice = choice;
        newChoice[item.id].ans4 = e;
        setChoice(newChoice)
    }

    const changeText5 = (e) => {
        setText5(e);
        var newChoice = choice;
        newChoice[item.id].ans5 = e;
        setChoice(newChoice)
    }

    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                <TextInput keyboardType="number-pad" style={styles.input} value={text1} onChangeText={changeText1}></TextInput>
                <TextInput keyboardType="number-pad" style={styles.input} value={text2} onChangeText={changeText2}></TextInput>
                <TextInput keyboardType="number-pad" style={styles.input} value={text3} onChangeText={changeText3}></TextInput>
                <TextInput keyboardType="number-pad" style={styles.input} value={text4} onChangeText={changeText4}></TextInput>
                <TextInput keyboardType="number-pad" style={styles.input} value={text5} onChangeText={changeText5}></TextInput>
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