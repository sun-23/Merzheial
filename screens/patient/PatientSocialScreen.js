import React from 'react';
import { StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import * as Linking from 'expo-linking';

import { View } from '../../components';

const {width} = Dimensions.get('window');

export const PatientSocialScreen = () => {

  const openFaceBook = () => {
    Linking.openURL("https://www.facebook.com/groups/1907244442928060");
  }

  return (
    <View isSafe style={styles.container}>
      <Text style={styles.header}>Social</Text>
      <View style={styles.link_view}>
        {/* facebook */}
        <Pressable style={styles.link_item} onPress={openFaceBook}>
          <Text style={styles.link_item_text}>FACEBOOK</Text>
          <Text style={styles.link_item_text}>คุยยามเช้า</Text>
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
    link_view: {
      alignSelf: 'center',
      flex: 1,
      justifyContent: 'space-evenly'
    },
    link_item: {
      width: width*0.6,
      height: width*0.6,
      alignItems: 'center',
      justifyContent: "center",
      borderRadius: 5,
      backgroundColor: "#1778f2",
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
      fontSize: 20,
      fontWeight: "bold",
      color: 'white'
    }
})

