import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import Checkbox from 'expo-checkbox';

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

export function C1CheckBox({item, setChoice, choice}) {

    const [checkboxDisplay1, setCBDisplay1] = useState(false);

    const setIsTrue = (value) => {
        setCBDisplay1(value)
        var newChoice = choice
        newChoice[item.id].isTrue = value
        setChoice(newChoice);
    }

    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>Is that correct?</Text>
                        <Checkbox
                        value={checkboxDisplay1}
                        color={checkboxDisplay1 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsTrue(newValue)}
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