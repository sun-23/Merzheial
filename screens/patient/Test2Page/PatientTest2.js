import React, { useState, useRef } from 'react'
import { StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, StatusBar, SafeAreaView, View} from 'react-native'
import { doc, setDoc, Timestamp } from "firebase/firestore"; 
import { Colors, auth, db, storage } from '../../../config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import uuid from 'react-native-uuid';


//pages
import { Intro } from './Intro';
import { C1 } from './C1';
import { AnsC1 } from './AnsC1';
import { Cimage } from './Cimage';
import { DrawClock } from './DrawClock';
import { DrawBlock } from './DrawBlock';
import { Outtro } from './Outtro';

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

const slides = [
    {
        id: 0,
        title: 'แบบทดสอบความจำ',
        subtitle: 'MONTREAL COGNITIVE ASSESSMENT (MOCA)',
        description: 'www.mocatest.org',
    },
    {
        id: 1,
        title: 'จำได้ไหม',
        subtitle: 'จำคำที่กำหนดให้ 3 คำต่อไปนี้ เดี๋ยวกลับมาถามนะ',
        alltext: ['หมี', 'โรงเรียน', 'แตงกวา', 'ไก่', 'งู', 'ส้มโอ', 'รถยนต์', 'เครื่องบิน'],
        text1: '',
        text2: '',
        text3: '',
    },
    {
        id: 2,
        title: 'ภาพนี้คือภาพอะไร',
        url: require('../../../assets/dog.webp'),
        user_answer: '',
        answer: 'หมา',
    },
    {
        id: 3,
        title: 'ภาพนี้คือภาพอะไร',
        url: require('../../../assets/lion.jpeg'),
        answer: 'สิงโต',
        user_answer: '',
    },
    {
        id: 4,
        title: 'ภาพนี้คือภาพอะไร',
        url: require('../../../assets/camel.jpg'),
        answer: 'อูฐ',
        user_answer: '',
    },
    {
        id: 5,
        title: 'จำได้ไหม 3 คำ ที่บอกให้จำตอนแรกมีอะไรบ้าง',
        subtitle: 'ยังจำได้ไหม จำได้หรือเปล่า?',
        anstext1: '',
        anstext2: '',
        anstext3: '',
    },
    {
        id: 6,
        title: 'วาดนาฬิกา',
        url: '',
    },
    {
        id: 7,
        title: 'วาดรูปกล่องตามภาพ',
        boxurl: require('../../../assets/Block.png'),
        url: '',
    },
    {
        id: 8,
        title: 'เสร็จสิ้น'
    }
]

const Slide = ({item, goNext, choice, setChoice}) => {
    if (item.id === 0) {
        return <Intro item={item} goNext={goNext}/>
    } else if (item.id === 1) {
        return <C1 item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 2) {
        return <Cimage item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 3){
        return <Cimage item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 4){
        return <Cimage item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 5) {
        return <AnsC1 item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 6) {
        return <DrawClock item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 7) {
        return <DrawBlock item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 8){
        return <Outtro item={item}/>
    } else {
        return <View><Text>error item {item.id}</Text></View>
    }
}

export const PatientTest2 = ({ navigation }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [choice, setChoice] = useState(slides);
    const refSlide = useRef();

    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    const goToNextSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex != slides.length) {
            const offset = nextSlideIndex * width;
            refSlide?.current.scrollToOffset({offset});
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
        // console.log(choice); //test
    };

    const uploadImageAsync = async (uri, callBack) => {
        if (uri) {
            console.log('image ok', uri);
            const imageRef = ref(storage, 'test-image/'+ uuid.v4());
            await fetch(uri)
            .then(response => response.blob())
            .then(blob => {
                const uploadTask = uploadBytesResumable(imageRef, blob);
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setUpLoadProgess(progress.toFixed(2));
                },
                (error) => {
                    setErrorState(error.message);
                },  
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        callBack(downloadURL);
                    });
                })
            });
        } else {
            callBack('');
        }
    }

    const putPointToFirebase = async () => {
        console.log(choice);
        const uuid_v4 = uuid.v4(); // => ex.'11edc52b-2918-4d71-9058-f7285e29d894'
        const docRef = doc(db, "users", auth.currentUser.uid , "patient_test", uuid_v4)
        const userRef = doc(db, "users", auth.currentUser.uid)
        let payload = {
            type: 'test-v2',
            server_time: Timestamp.now(),
            user_time: new Date(),
            choice1: {
                title: choice[1].title,
                subtitle: choice[1].subtitle,
                text1: choice[1].text1,
                text2: choice[1].text2,
                text3: choice[1].text3,
                anstext1: choice[5].anstext1,
                anstext2: choice[5].anstext2,
                anstext3: choice[5].anstext3
            },
            choice2: choice[2],
            choice3: choice[3],
            choice4: choice[4],
        }
     
        await setDoc(docRef, payload).then(() => {
            console.log('upload choice 1-4');
        })

        // upload choice 5 (choice[6])
        await uploadImageAsync(choice[6].url , async (url) => {
            await setDoc(docRef, {
                choice5: {
                    url: url,
                    title: choice[6].title
                }
            } ,{merge: true}).then(() => {
                console.log('upload choice 5');
            })
        });

        // upload choice 6 (choice[7])
        await uploadImageAsync(choice[7].url , async (url) => {
            await setDoc(docRef, {
                choice6: {
                    url: url,
                    title: choice[7].title
                }
            } ,{merge: true}).then(() => {
                console.log('upload choice 6');

                if (navigation != null) {
                    navigation.goBack();
                }
            })
        });

        await setDoc(userRef, {isTest: true}, {merge: true}).then(() => {
            console.log('add patient moca test');
        })
    }

    const Footer = () => {
        return (
            <View
                style={{
                height: height * 0.15,
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                }}>
                {/* Indicator container */}
                <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                }}>
                {/* Render indicator */}
                {slides.map((_, index) => (
                    <View
                    key={index}
                    style={[
                        styles.indicator,
                        currentSlideIndex == index && {
                        backgroundColor: COLORS.white,
                        width: 25,
                        },
                    ]}
                    />
                ))}
                </View>

                {/* Render buttons */}
                <View style={{marginBottom: 20}}>
                {currentSlideIndex == slides.length - 1 ? (
                    <View style={{height: 50}}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={putPointToFirebase}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}>
                        ตกลง
                        </Text>
                    </TouchableOpacity>
                    </View>
                ) : (
                    (currentSlideIndex >= 1) ?
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            disabled={currentSlideIndex === 0 ? true : false}
                            activeOpacity={0.8}
                            onPress={goToNextSlide}
                            style={styles.btn}>
                            <Text style={{fontWeight: 'bold', fontSize: 15}}>
                            ต่อไป
                            </Text>
                        </TouchableOpacity>
                    </View> : 
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            disabled={currentSlideIndex !== 0 ? true : false}
                            activeOpacity={0.8}
                            onPress={() => {
                                navigation.goBack()
                            }}
                            style={styles.btn}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, color: "red"}}>
                            ยกเลิก
                            </Text>
                        </TouchableOpacity>
                    </View> 
                )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.orange}}>
            <StatusBar backgroundColor={Colors.orange} />
            <FlatList 
                ref={refSlide}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                contentContainerStyle={{height: height * 0.75}}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={slides}
                pagingEnabled
                renderItem={({item}) => 
                    <Slide 
                        item={item} 
                        goNext={goToNextSlide} 
                        choice={choice}
                        setChoice={setChoice}
                    />
                }
            />
            <Footer />
        </SafeAreaView>
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