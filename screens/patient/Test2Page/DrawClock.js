import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

export function DrawClock({item, setChoice, choice}) {

    const [image, setImage] = useState();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            var newChoice = choice
            newChoice[item.id].url = result.uri
            setChoice(newChoice);
        }
    };


    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                {image ? 
                    <Image 
                        style={{
                            height: width*0.7, 
                            width: width*0.7, 
                            borderRadius: 5,
                            margin: 15
                        }}  
                        source={{uri: image}}
                    /> : 
                    null
                }
                <TouchableOpacity 
                    style={{
                        height: 60,
                        width: width * 0.9, 
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: 5
                    }} 
                    onPress={pickImage}
                >
                    <Text>เลือกภาพวาด</Text>
                </TouchableOpacity>
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