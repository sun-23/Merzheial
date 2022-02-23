import React from 'react';
import { StyleSheet, Text, Dimensions, Pressable, ImageBackground, ScrollView } from 'react-native';
import * as Linking from 'expo-linking';

import { View } from '../../components';

const {width} = Dimensions.get('window');

const data = [
  {
    id: 0,
    title: "การรักษาโรคอัลไซเมอร์",
    url: "https://hd.co.th/treatment-of-alzheimers",
    imageUrl: "https://static.hd.co.th/989x504/system/blog_articles/main_hero_images/000/004/162/original/iStock-479454564.jpg"
  },
  {
    id: 1,
    title: "การดูแลผู้ป่วยอัลไซเมอร์ที่บ้าน",
    url: "https://ram-hosp.co.th/news_detail/58",
    imageUrl: "https://www.ram-hosp.co.th/upload/ck/1565930585.jpg"
  },
  {
    id: 2,
    title: "“วิธีดูแลผู้ป่วยโรคอัลไซเมอร์” ในช่วงโควิด-19 ระบาด",
    url: "https://www.chula.ac.th/news/41231/",
    imageUrl: "https://www.chula.ac.th/wp-content/uploads/2021/02/20210130_1_Edit1_hotnews.jpg"
  },
  {
    id: 3,
    title: "ดูแลผู้ป่วยอัลไซเมอร์อย่างไร ให้ทั้งตนเองและผู้ป่วยมีความสุข",
    url: "https://www.phyathai.com/article_detail/2190/th/ดูแลผู้ป่วยอัลไซเมอร์อย่างไร_ให้ทั้งตนเองและผู้ป่วยมีความสุข",
    imageUrl: "http://www.phyathai.com/photo/forms/db7d3a72862992a19559e7b91fcacdd3.jpg"
  },
  {
    id: 4,
    title: "อัลไซเมอร์โรคที่ทำให้เข้าใจโลก ฟังวิธีรับมือของลูกที่ดูแลแม่ป่วยอัลไซเมอร์",
    url: "https://www.youtube.com/watch?v=W83IFnZDugk",
    imageUrl: "https://i3.ytimg.com/vi/W83IFnZDugk/maxresdefault.jpg"
  },
  {
    id: 5,
    title: "อัลไซเมอร์กับผู้สูงวัย... สู้ด้วยพลังใจคนใกล้ตัว | บำรุงราษฎร์",
    url: "https://www.youtube.com/watch?v=tceO0zyw1mE",
    imageUrl: "https://i3.ytimg.com/vi/tceO0zyw1mE/maxresdefault.jpg"
  },
  {
    id: 6,
    title: "“อัลไซเมอร์” อาการป่วยที่คนรอบข้างควรใส่ใจ",
    url: "https://www.youtube.com/watch?v=Xmhkz8z3wZs",
    imageUrl: "https://i3.ytimg.com/vi/Xmhkz8z3wZs/hqdefault.jpg"
  },
  {
    id: 7,
    title: "อัลไซเมอร์",
    url: "https://www.bumrungrad.com/th/conditions/alzheimer",
    imageUrl: "https://positioningmag.com/wp-content/uploads/importedmedia/blogmedia-21768.jpg"
  },
  {
    id: 8,
    title: "การดูแลผู้ป่วยอัลไซเมอร์",
    url: "https://www.siamhealth.net/public_html/Disease/neuro/alzheimer/alzheimers_care.html",
    imageUrl: "https://www.siamhealth.net/public_html/images/stroke/alz.jpg"
  },
  {
    id: 9,
    title: "การดูแลผู้ป่วยอัลไซเมอร์",
    url: "http://www.azthai.org/เกี่ยวกับสมองเสื่อม/6-เทคนิคการดูแล-1044-การดูแลผู้ป่วยอัลไซเมอร์",
    imageUrl: "http://www.azthai.org/elctfl/article/article1-1044.jpg"
  },
]

export const Blog = () => {

  const openLink = (url) => {
    Linking.openURL(url);
  }

  return (
    <View isSafe style={styles.container}>
      <Text style={styles.header}>Blog</Text>
      <View style={styles.link_view}>
        <ScrollView style={{flex: 1, paddingHorizontal: 10, marginBottom: 50}}>
          {data.map(item => {
            return <Pressable key={item.id} style={styles.link_item} onPress={() => openLink(item.url)}>
              <ImageBackground 
                imageStyle={{ borderRadius: 10 }} 
                resizeMode="stretch" 
                style={styles.image} 
                source={{uri: item.imageUrl}}
              >
                <Text style={styles.link_item_text}>{item.title}</Text>
              </ImageBackground>
            </Pressable>
          })}
        </ScrollView>
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

