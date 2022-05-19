import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Dimensions, Image } from 'react-native';
import { PicturePuzzle } from 'react-native-picture-puzzle';
import { Colors } from '../../../../config';
import { View } from '../../../../components'
const {width, height} = Dimensions.get('window');

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

const ImgList = [
  'https://cdn3.vectorstock.com/i/thumb-large/39/62/head-of-cartoon-cow-vector-23863962.jpg', 
  'https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png',
  'https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/256/22215-dog-icon.png'
]

export default function Game() {

  const [index, setIndex] = React.useState(0);

  const [source, setSource] = React.useState({
    uri: 'https://icons.iconarchive.com/icons/google/noto-emoji-animals-nature/256/22215-dog-icon.png',
  });

  const originalPieces = React.useMemo(() => (
    [...Array(9)].map((_, i) => i)
  ), []);

  const shuffledPieces = React.useMemo(() => {
    const p = [...originalPieces];
    shuffle(p);
    return p;
  }, [originalPieces]);

  const [hidden, setHidden] = React.useState(0);
  const [pieces, setPieces] = React.useState(shuffledPieces);

  const renderLoading = React.useCallback(() => (
    <View style={styles.center}>
      <ActivityIndicator />
    </View>
  ), []);

  const onChange = React.useCallback((nextPieces, nextHidden) => {
    setPieces([...nextPieces]);
    setHidden(nextHidden);
  }, [setPieces, setHidden]);

  const solve = React.useCallback(() => {
    setPieces(originalPieces);
    setHidden(null);
  }, [setPieces, originalPieces]);

  const retry = React.useCallback(() => {
    setPieces(shuffledPieces);
    setHidden(0);
  }, [setPieces, shuffledPieces]);

  const RandomImg = () => {
    setIndex(index => index >= 2 ? 0 : index+=1)
    // console.log(ImgList[index]);
    switch (index) {
      case 0:
        setSource({ uri: ImgList[0]})
        break;
      
      case 1:
        setSource({ uri: ImgList[1]})
        break;
    
      default:
        setSource({ uri: ImgList[2]})
        break;
    }
  }

  return (
    <View isSafe style={styles.container}>
      <Text style={styles.header}>picture sorting game</Text>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>picture {index + 1}</Text>
      <Image source={source} style={{width: 50, height: 50}}/>
      <View style={{justifyContent: "center", height: height, width: width}}>
        <PicturePuzzle
          style={styles.shadow}
          renderLoading={renderLoading}
          pieces={pieces}
          hidden={hidden}
          onChange={onChange}
          size={290}
          source={source}
        />
        <View style={[styles.row]}>
          <TouchableOpacity onPress={retry} style={styles.btn}>
            <Text style={{color: 'white', fontSize: 20}}>
              play again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={solve} style={styles.btn}>
            <Text style={{color: 'white', fontSize: 20}}>
              answer
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={RandomImg} style={[styles.btn, {marginBottom: height * 0.3, alignSelf: 'center'}]}>
            <Text style={{color: 'white', fontSize: 20}}>
              random new pictures
            </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    backgroundColor: 'white',
    backgroundColor: 'white',
    width: width
  },
  header: {
    fontWeight: 'bold', 
    fontSize: 30,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  btn: {
    width: width*0.3,
    height: 50,
    borderRadius: 5,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', justifyContent: "space-evenly", width: width},
  shadow: {
    alignSelf: 'center',
    shadowColor: "#555",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10.0,
  },
})