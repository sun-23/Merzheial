import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import Checkbox from 'expo-checkbox';

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

export function C15({item, setChoice, choice}) {

    const [checkboxDisplay1, setCBDisplay1] = useState(false);
    const [checkboxDisplay2, setCBDisplay2] = useState(false);

    const setIsSub1 = (value) => {
        setCBDisplay1(value)
        var newChoice = choice
        newChoice[item.id].is1True = value
        setChoice(newChoice);
    }

    const setIsSub2 = (value) => {
        setCBDisplay2(value)
        var newChoice = choice
        newChoice[item.id].is2True = value
        setChoice(newChoice);
    }

    const setIsSub3 = (value) => {
        setCBDisplay2(value)
        var newChoice = choice
        newChoice[item.id].is3True = value
        setChoice(newChoice);
    }

    const setIsSub4 = (value) => {
        setCBDisplay2(value)
        var newChoice = choice
        newChoice[item.id].is4True = value
        setChoice(newChoice);
    }
    const setIsSub5 = (value) => {
        setCBDisplay2(value)
        var newChoice = choice
        newChoice[item.id].is5True = value
        setChoice(newChoice);
    }

    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>{item.sub1}</Text>
                    <Checkbox
                        value={checkboxDisplay1}
                        color={checkboxDisplay1 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsSub1(newValue)}
                    />
                </View>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>{item.sub2}</Text>
                    <Checkbox
                        value={checkboxDisplay2}
                        color={checkboxDisplay2 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsSub2(newValue)}
                    />
                </View>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>{item.sub3}</Text>
                    <Checkbox
                        value={checkboxDisplay2}
                        color={checkboxDisplay2 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsSub3(newValue)}
                    />
                </View>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>{item.sub4}</Text>
                    <Checkbox
                        value={checkboxDisplay2}
                        color={checkboxDisplay2 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsSub4(newValue)}
                    />
                </View>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>{item.sub5}</Text>
                    <Checkbox
                        value={checkboxDisplay2}
                        color={checkboxDisplay2 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsSub5(newValue)}
                    />
                </View>
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
  subtitle: {
    color: COLORS.white,
    fontSize: 20,
    margin: 10,
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