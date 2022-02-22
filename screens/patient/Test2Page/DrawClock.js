import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Checkbox from 'expo-checkbox';

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

export function DrawClock({item, setChoice, choice}) {

    const [image, setImage] = useState();
    const [checkboxDisplay1, setCBDisplay1] = useState(false);
    const [checkboxDisplay2, setCBDisplay2] = useState(false);
    const [checkboxDisplay3, setCBDisplay3] = useState(false);

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
            let { width, height } = result;
            const manipResult = await manipulateAsync(
                result.uri,
                [{ resize: { width: 480, height: (height/width*480) } }],
                { format: SaveFormat.JPEG, compress: 1 }
            );
            console.log(manipResult);
            setImage(manipResult.uri);
            var newChoice = choice
            newChoice[item.id].url = manipResult.uri
            setChoice(newChoice);
        }
    };

    const setIsContour = (value) => {
        setCBDisplay1(value)
        var newChoice = choice
        newChoice[item.id].contour = value
        setChoice(newChoice);
    }

    const setIsHands = (value) => {
        setCBDisplay2(value)
        var newChoice = choice
        newChoice[item.id].hands = value
        setChoice(newChoice);
    }

    const setIsNumbers = (value) => {
        setCBDisplay3(value)
        var newChoice = choice
        newChoice[item.id].numbers_pos = value
        setChoice(newChoice);
    }

    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                {image ? 
                    <Image 
                        style={{
                            height: width*0.5, 
                            width: width*0.5, 
                            borderRadius: 5,
                            margin: 15
                        }}  
                        source={{uri: image}}
                    /> : 
                    null
                }
                <Text style={styles.subtitle}>ให้ติก checkbox ถ้าภาพมีความเหมือนกัน</Text>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>รูปร่าง</Text>
                    <Checkbox
                        value={checkboxDisplay1}
                        color={checkboxDisplay1 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsContour(newValue)}
                    />
                </View>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>เข็มนาฬิกา</Text>
                    <Checkbox
                        value={checkboxDisplay2}
                        color={checkboxDisplay2 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsHands(newValue)}
                    />
                </View>
                <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                    <Text style={styles.subtitle}>ตำแหน่งตัวเลข</Text>
                    <Checkbox
                        value={checkboxDisplay3}
                        color={checkboxDisplay3 ? '#4630EB' : undefined}
                        onValueChange={(newValue) => setIsNumbers(newValue)}
                    />
                </View>
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