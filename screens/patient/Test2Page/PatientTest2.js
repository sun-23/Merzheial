import React, { useState, useRef } from 'react'
import { StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, StatusBar, SafeAreaView, View, Modal, ScrollView} from 'react-native'
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
import { C1CheckBox } from './C_that1checkbox';
import { C2CheckBox } from './C_that2checkbox';
import { C8 } from './C8';
import { C11 } from './C11';
import { C15 } from './C15';

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

const slides = [
    {
        id: 0,
        title: 'memory test',
        subtitle: 'MONTREAL COGNITIVE ASSESSMENT (MOCA)',
        description: 'www.mocatest.org',
    },
    {
        id: 1,
        title: 'Do you remember',
        subtitle: 'Remember the words given to the following 4 words. Come back to ask.',
        alltext: ['bear', 'school', 'cucumber', 'chicken', 'snake', 'pomelo', 'car', 'plane'],
        text1: '',
        text2: '',
        text3: '',
        text4: '',
        text5: '',
    },
    {
        id: 2,
        title: 'what is this picture',
        url: require('../../../assets/dog.webp'),
        user_answer: '',
        answer: 'dog',
    },
    {
        id: 3,
        title: 'what is this picture',
        url: require('../../../assets/lion.jpeg'),
        answer: 'lion',
        user_answer: '',
    },
    {
        id: 4,
        title: 'what is this picture',
        url: require('../../../assets/camel.jpg'),
        answer: 'camel',
        user_answer: '',
    },
    {
        id: 5,
        title: 'Do you remember the 5 words that told you to remember the first time?',
        subtitle: 'Do you still remember, do you remember?',
        anstext1: '',
        anstext2: '',
        anstext3: '',
        anstext4: '',
        anstext5: '',
    },
    {
        id: 6,
        title: 'Draw a clock at 10:30',
        url: '',
        contour: false,
        hands: false,
        numbers_pos: false,
    },
    {
        id: 7,
        title: 'Draw the box as in the picture.',
        boxurl: require('../../../assets/Block.png'),
        url: '',
        isSimilar: false,
    },
    {
        id: 8,
        title: 'Alternate numbers with letters such as 1A2B3C... without spaces. Type an answer from the letters ABCDE 12345.',
        anstext: '',
    },
    {
        id: 9,
        title: 'Say 21854 forward and 742 backward.',
        sub1: '2 1 8 5 4',
        sub2: '7 4 2',
        is1True: false,
        is2True: false,
    },
    {
        id: 10,
        title: 'Clap your hands whenever there is an A, ready to speak from the letter. FBACMNAAJKLBAFAKDEAAAJAMOFAAB',
        isTrue: false,
    },
    {
        id: 11,
        title: 'Subtract numbers from 100 by 7 in sequence of 5 numbers.',
        ans1: 0,
        ans2: 0,
        ans3: 0,
        ans4: 0,
        ans5: 0,
        key1: 93,
        key2: 86,
        key3: 79,
        key4: 72,
        key5: 65,
    },
    {
        id: 12,
        title: 'Say the following sentences correctly.',
        sub1: 'I know Jom was the only one who came to help today.',
        sub2: 'Cats tend to hide behind chairs when there is a dog in the room.',
        is1True: false,
        is2True: false,
    },
    {
        id: 13,
        title: 'Say as many words that start with A.',
        isTrue: false,
    },
    {
        id: 14,
        title: 'Tell the similarities of the following.',
        sub1: 'train-bicycle',
        sub2: 'clock-ruler',
        is1True: false,
        is2True: false,
    },
    {
        id: 15,
        title: 'State the date, month, year, day of the week, place, province.',
        sub1: 'date',
        sub2: 'month',
        sub3: 'year',
        sub4: 'day of the week',
        sub5: 'place',
        sub6: 'province',
        is1True: false,
        is2True: false,
        is3True: false,
        is4True: false,
        is5True: false,
        is6True: false,
    },
    {
        id: 16,
        title: 'finish'
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
        return <C8 item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 11){
        return <C11 item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 15){
        return <C15 item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 9 || item.id === 12 || item.id === 14){
        return <C2CheckBox item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 10 || item.id === 13){
        return <C1CheckBox item={item} choice={choice} setChoice={setChoice}/>
    } else if (item.id === 16){
        return <Outtro item={item}/>
    } else {
        return <View><Text>error item {item.id}</Text></View>
    }
}

export const PatientTest2 = ({ navigation, firstTest }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [choice, setChoice] = useState(slides);
    const [enable, setEnable] = useState(true)
    const [percentUp, setPercent] = useState(0)
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
                    setPercent(progress.toFixed(2));
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

    const checkScore = () => {
        let score = 0;
        let c1answer = [choice[5].anstext2, choice[5].anstext1, choice[5].anstext3, choice[5].anstext4, choice[5].anstext5]
        let c1answerKey = [choice[1].text2, choice[1].text1, choice[1].text3, choice[1].text4, choice[1].text5]
        let c1IntersectionAnsAndKey = c1answer.filter(value => c1answerKey.includes(value))
        console.log(c1IntersectionAnsAndKey, c1answer, c1answerKey);
        score += c1IntersectionAnsAndKey.length

        if (choice[2].user_answer.toLowerCase() === 'dog' || choice[2].user_answer === 'หมา') {
            score += 1
            // console.log('dog t');
        }
        // console.log(choice[2].user_answer.toLowerCase());

        if (choice[3].user_answer.toLowerCase() === 'lion' || choice[3].user_answer === 'สิงโต') {
            score += 1
            // console.log('lion t');
        }
        // console.log(choice[3].user_answer.toLowerCase());

        if (choice[4].user_answer.toLowerCase() === 'camel' || choice[4].user_answer === 'อูฐ') {
            score += 1
            // console.log('camel t');
        }
        // console.log(choice[4].user_answer.toLowerCase());

        score += (choice[6].contour ? 1 : 0)
        score += (choice[6].hands ? 1 : 0)
        score += (choice[6].numbers_pos ? 1 : 0)

        score += (choice[7].isSimilar ? 1 : 0)
        
        if (choice[8].anstext.toLowerCase() === '1a2b3c4d5e') {
            score += 1
            // console.log(choice[8].anstext.toLowerCase());
        }

        score += (choice[9].is1True ? 1 : 0)
        score += (choice[9].is2True ? 1 : 0)
        score += (choice[10].isTrue ? 1 : 0)

        let c11correct = 0;
        for (let i = 1; i <= 5; i++) {
            // console.log(choice[11]['ans'+i], choice[11]['key'+i]);
            if (choice[11]['ans'+i] == choice[11]['key'+i]) {
                c11correct += 1
            }
        }
        // console.log('c11 point', (c11correct >= 4 ? 3 : (c11correct >= 2 ? 2 : (c11correct >= 1 ? 1 : 0))));
        score += (c11correct >= 4 ? 3 : (c11correct >= 2 ? 2 : (c11correct >= 1 ? 1 : 0)))

        score += (choice[12].is1True ? 1 : 0)
        score += (choice[12].is2True ? 1 : 0)

        score += (choice[13].isTrue ? 1 : 0)

        score += (choice[14].is1True ? 1 : 0)
        score += (choice[14].is2True ? 1 : 0)

        score += (choice[15].is1True ? 1 : 0)
        score += (choice[15].is2True ? 1 : 0)
        score += (choice[15].is3True ? 1 : 0)
        score += (choice[15].is4True ? 1 : 0)
        score += (choice[15].is5True ? 1 : 0)
        score += (choice[15].is6True ? 1 : 0)

        console.log('score', score);
        console.log('max score', 30);

        return score;
    }

    const putPointToFirebase = async () => {
        console.log(choice);
        const score = checkScore();
        console.log(score);
        
        setEnable(false);
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
            choice7: choice[8],
            choice8: choice[9],
            choice9: choice[10],
            choice10: choice[11],
            choice11: choice[12],
            choice12: choice[13],
            choice13: choice[14],
            choice14: choice[15],
            total_score: score,
            time_miliseconds: new Date().valueOf()
        }
     
        await setDoc(docRef, payload).then(() => {
            console.log('upload choice 1-4');
        })

        // upload choice 5 (choice[6])
        await uploadImageAsync(choice[6].url , async (url) => {
            await setDoc(docRef, {
                choice5: {
                    url: url,
                    title: choice[6].title,
                    contour: choice[6].contour,
                    hands: choice[6].hands,
                    numbers_pos: choice[6].numbers_pos
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
                    title: choice[7].title,
                    isSimilar: choice[7].isSimilar
                }
            } ,{merge: true}).then(() => {
                console.log('upload choice 6');
                setEnable(true);
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
                        disabled={!enable}
                        style={styles.btn}
                        onPress={putPointToFirebase}>
                        <Text style={{fontWeight: 'bold', fontSize: 15}}>
                        submit
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
                            next
                            </Text>
                        </TouchableOpacity>
                    </View> : 
                    <View style={{flexDirection: 'row'}}>
                        {(!firstTest) ? <TouchableOpacity
                            disabled={currentSlideIndex !== 0 ? true : false}
                            activeOpacity={0.8}
                            onPress={() => {
                                if(navigation){
                                    navigation.goBack()
                                }
                            }}
                            style={styles.btn}>
                            <Text style={{fontWeight: 'bold', fontSize: 15, color: "red"}}>
                            cancel
                            </Text>
                        </TouchableOpacity> : null}
                    </View> 
                )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.orange}}>
            <StatusBar backgroundColor={Colors.orange} />
            <Modal
                transparent={true}
                visible={percentUp > 0 && percentUp < 100 ? true : false}
            >
                <View style={{flex: 1 ,justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.modalView}>
                        <Text style={[styles.textStyle, {color: 'black'}]}>Image uploaded {percentUp}%</Text>
                    </View>
                </View>
            </Modal>
                <FlatList 
                    ref={refSlide}
                    onMomentumScrollEnd={updateCurrentSlideIndex}
                    contentContainerStyle={{height: height * 0.75}}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={slides}
                    pagingEnabled
                    renderItem={({item}) => 
                        <ScrollView>
                            <Slide 
                                item={item} 
                                goNext={goToNextSlide} 
                                choice={choice}
                                setChoice={setChoice}
                            />
                        </ScrollView>
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
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 50,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});