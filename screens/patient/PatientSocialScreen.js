import React from 'react';
import { StyleSheet, Text, Dimensions, Pressable, ImageBackground } from 'react-native';
import * as Linking from 'expo-linking';

import { View } from '../../components';

const {width} = Dimensions.get('window');

export const PatientSocialScreen = () => {

  const openMeet = () => {
    Linking.openURL("https://meet.google.com/fnk-hpqo-mxc");
  }

  return (
    <View isSafe style={styles.container}>
      <Text style={styles.header}>Social</Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Pressable style={styles.link_item} onPress={openMeet}>
          <ImageBackground 
            imageStyle={{ borderRadius: 10 }} 
            resizeMode="stretch" 
            style={styles.image} 
            source={{uri: "https://www.familyhappiness.co/wp-content/uploads/2020/12/02-2.jpg"}}
          >
            <Text style={styles.link_item_text}>พูดคุยกิจกรรม</Text>
          </ImageBackground>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        backgroundColor: 'white',
        // justifyContent: 'center'
    },
    header: {
        fontWeight: 'bold', 
        fontSize: 30,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 10,
    },
    link_item: {
      width: width*0.8,
      height: width*0.8,
      alignItems: 'center',
      justifyContent: "center",
      borderRadius: 10,
      marginBottom: 12,
      // shadow
      shadowRadius: 2.62,
      shadowOpacity: 0.23,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      elevation: 4,
    },
    link_item_text: {
      fontSize: 30,
      lineHeight: 50,
      fontWeight: "bold",
      color: 'white',
      textAlign: 'center',
      backgroundColor: '#000000c0'
    },
    image: {
      justifyContent: "center",
      alignItems: "center",
      width: width*0.8,
      height: width*0.8,
    }
})

