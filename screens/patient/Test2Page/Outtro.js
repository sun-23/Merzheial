import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React from 'react'
const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

export const Outtro = ({item}) => {
    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
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
});