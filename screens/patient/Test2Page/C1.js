import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

function found(arrayX, x) {
    return (arrayX.find(e => e === x) !== undefined) ? true : false
}

function random(alltext){
    var n = [];
    var pushed_index = [];
    for (let i = 0; i < 5; i++) {
        var index = Math.floor(Math.random() * alltext.length)
        if (!found(pushed_index, index)) {
            n.push(alltext[index])
            pushed_index.push(index)
        } else {
            i = i - 1;
        }
    }
    return n
}

export const C1 = ({item, setChoice, choice}) => {

    const [test_text, setText] = useState([])

    useEffect(() => {
        let newChoice = choice
        var testtext = random(newChoice[item.id].alltext)
        newChoice[item.id].text1 = testtext[0]
        newChoice[item.id].text2 = testtext[1]
        newChoice[item.id].text3 = testtext[2]
        newChoice[item.id].text4 = testtext[3]
        newChoice[item.id].text5 = testtext[4]
        setChoice(newChoice)
        setText(testtext)
    }, [])

    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.title}>{item.subtitle}</Text>
                <Text style={styles.title}>{test_text[0]} {test_text[1]} {test_text[2]} {test_text[3]} {test_text[4]}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.white,
    fontSize: 18,
    marginTop: 10,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
  },
  minisubtitle: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: 10,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: '#C36A2D',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});