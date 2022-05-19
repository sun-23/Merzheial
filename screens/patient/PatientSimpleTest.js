import React, { useState, useRef } from 'react'
import { StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, StatusBar, SafeAreaView, View} from 'react-native'
import { Colors, db, auth } from '../../config';
import { doc, setDoc, Timestamp } from "firebase/firestore"; 
import uuid from 'react-native-uuid';

const {width, height} = Dimensions.get('window');
const COLORS = {primary: '#282534', white: '#fff'};

const slides = [
    {
        id: 0,
        title: 'Memory Performance Screening 14 Questions',
        subtitle: 'clarification',
        des1: 'Score 1 when the event has never happened or may happen infrequently in 1 year',
        des2: 'Score 2 when the event is infrequent or may occur 1 or 2 times in 1 month',
        des3: 'Score 3 when the event happens relatively frequently or may occur almost weekly',
        des4: 'Score 4 when that happens most days',
        description: 'Source: Translated from an article in the British Medical Association by Chankanya Tantileepicorn (M.Sc. in Clinical Psychology), Mahidol University Science and Technology Research and Development Institute, and Dr. Sopa Krikkraikul, Neurology Unit. College of Medicine Bangkok and Vajira Hospital',
        isTest: false,
    },
    {
        id: 1,
        title: 'Can not find household items',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 2,
        title: 'Can not remember the places I have been to often',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 3,
        title: 'Had to go back and review the work even though it was intended to be done twice.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 4,
        title: 'Forget about the things that you intend to take out of the house as well.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 5,
        title: 'inability to understand the subject matter in the newspaper or journals that I read.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 6,
        title: 'Forget what you heard yesterday or a few days ago.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 7,
        title: 'Forgot to share the message that someone else gave you.\nTell someone else.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 8,
        title: 'Forgetting personal information such as date of birth, address',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 9,
        title: 'confused about the details of what was heard',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 10,
        title: 'Forget where the item was placed on a regular basis, or look for it in a place where it was unlikely to be placed.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 11,
        title: 'While traveling or walking, or in a building that you used to visit often, you tend to get lost or lost.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 12,
        title: 'Certain routines have to be repeated twice because mistakes occur, such as adding too much sugar to the cooking time. or walk to comb the hair again which, after a while, had just finished combing his hair.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 13,
        title: 'Tell the same story over and over again, which just a moment ago.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 14,
        title: 'Forget close friends or close relatives or people who are in close contact with each other often.',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 15,
        title: 'finish',
        subtitle: 'advice',
        isTest: false,
    },
]

const answer_type = [
    "An event that never happened or happened very rarely in 1 year.",
    "The incident happened once or twice in a 1-month period.",
    "The event happened almost every week.",
    "The incident happened almost every day."
]

const result_type = {
    a: 'Very good cerebral performance',
    b: 'Moderate brain function, should be advised to improve cognitive function',
    c: 'Relatively low cognitive performance, advice should be given to improve cognitive performance',
    d: 'Poor brain function, seek medical attention'
}

const TestItem = ({item, clickChioce}) => {
    return (
        <View style={{flex: 1, width: width, alignItems: 'center'}} key={item.id}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>คำถามข้อที่ {item.id} จากทั้งหมด 14 ข้อ</Text>
                <Text style={styles.title}>{item.title}</Text>
            </View>
            {answer_type.map((value, index) => 
            //bug
                <TouchableOpacity
                    key={index} 
                    style={{
                        height: 100,
                        flexDirection: 'row',
                        borderWidth: (item.choose_num == (index+1)) ? 4 : 0,
                        borderColor: "#fff",
                        borderRadius: 5,
                        width: width * 0.9,
                        backgroundColor: (item.choose_num == (index+1)) ? '#FF4848' : '#fff', //FF4848 red 9DDAC6 green
                        alignItems: 'center',
                        marginVertical: 5
                    }} 
                    onPress={() => clickChioce(item.id, index+1)}
                >
                    <Text 
                        style={{
                            marginHorizontal: 20,
                            fontWeight: 'bold',
                            fontSize: 20, 
                            color: (item.choose_num == (index+1)) ? '#fff' : Colors.black
                        }}
                    >
                        {value}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const Intro = ({item, goNext}) => {
    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.des1}</Text>
                <Text style={styles.subtitle}>{item.des2}</Text>
                <Text style={styles.subtitle}>{item.des3}</Text>
                <Text style={styles.subtitle}>{item.des4}</Text>
                <Text style={styles.minisubtitle}>{item.description}</Text>
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
                    onPress={goNext}
                >
                    <Text>เริ่มกันเลย</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Outtro = ({item, point}) => {

    const Comment = () => {
        if (point >= 14 && point <= 19) {
            return <Text style={styles.title}>{result_type.a}</Text>
        } else if (point >= 20 && point <= 29) {
            return <Text style={styles.title}>{result_type.b}</Text>
        } else if (point >= 30 && point <= 39) {
            return <Text style={styles.title}>{result_type.c}</Text>
        } else if (point >= 40 && point <= 56) {
            return <Text style={styles.title}>{result_type.d}</Text>
        } else {
            return <Text style={styles.title}></Text>
        }
    }
    return (
        <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', width: width * 0.9}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.title}>{item.subtitle}</Text>
                <Comment />
            </View>
        </View>
    )
}

const Slide = ({item, clickChioce, goNext, point}) => {
    if (item.isTest) {
        return <TestItem item={item} clickChioce={clickChioce}/>
    } else if (!item.isTest && item.id == 0) {
        return <Intro item={item} goNext={goNext} />
    } else if (!item.isTest && item.id == 15) {
        return <Outtro item={item} point={point}/>
    }
}

export const PatientSimpleTest = ({navigation}) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [choice, setChoice] = useState(slides);
    const [point, setPoint] = useState(0);
    const ref = useRef();

    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    const goToNextSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex != slides.length) {
        const offset = nextSlideIndex * width;
        ref?.current.scrollToOffset({offset});
        setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const goToPrevSlide = () => {
        const prevSlideIndex = currentSlideIndex - 1;
        if (prevSlideIndex > 0) {
            const offset = prevSlideIndex * width;
            ref?.current.scrollToOffset({offset});
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    const click_choice = (id, answer) => {
        console.log(id, answer);
        var new_choice = choice;
        new_choice[id].choose_num = answer;
        setChoice(new_choice);
        // console.log(new_choice);
        // console.log(choice[id]);
        if (id === 14) { //last choice
            calculatePoint()
        }
        goToNextSlide();
    }

    const calculatePoint = () => {
        console.log('calculate point');
        choice.map(item => {
            if (item.choose_num) {
                setPoint(prev => prev + item.choose_num);
            }
        })
    }

    const putPointToFirebase = async () => {
        console.log(point);
        const uuid_v4 = uuid.v4(); // => ex.'11edc52b-2918-4d71-9058-f7285e29d894'
        const docRef = doc(db, "users", auth.currentUser.uid , "patient_test", uuid_v4)
        const userRef = doc(db, "users", auth.currentUser.uid)
        let payload = {
            server_time: Timestamp.now(),
            user_time: new Date(),
            score: point,
            description: '',
            uuid: uuid_v4,
            choice: choice,
            time_miliseconds: new Date().valueOf(),
            type: 'simple'
        }
        if (point >= 14 && point <= 19) {
            payload.description = result_type.a;
        } else if (point >= 20 && point <= 29) {
            payload.description = result_type.b;
        } else if (point >= 30 && point <= 39) {
            payload.description = result_type.c;
        } else if (point >= 40 && point <= 56) {
            payload.description = result_type.d;
        }
        await setDoc(docRef, payload).then(() => {
            console.log('add patient_test-point');
            if (navigation != null) {
                navigation.goBack();
            }
        })
        await setDoc(userRef, {isTest: true}, {merge: true}).then(() => {
            console.log('add patient test');
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
                        submit
                        </Text>
                    </TouchableOpacity>
                    </View>
                ) : (
                    (currentSlideIndex >= 2) ?
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                disabled={currentSlideIndex === 0 ? true : false}
                                activeOpacity={0.8}
                                onPress={goToPrevSlide}
                                style={styles.btn}>
                                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                goBack
                                </Text>
                            </TouchableOpacity>
                        </View> : (
                            (currentSlideIndex === 0) ? 
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    disabled={currentSlideIndex !== 0 ? true : false}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        navigation.goBack()
                                    }}
                                    style={styles.btn}>
                                    <Text style={{fontWeight: 'bold', fontSize: 15, color: "red"}}>
                                    cancel
                                    </Text>
                                </TouchableOpacity>
                            </View> : null
                        )
                )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.orange}}>
            <StatusBar backgroundColor={Colors.orange} />
            <FlatList 
                ref={ref}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                contentContainerStyle={{height: height * 0.75}}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={slides}
                pagingEnabled
                renderItem={({item}) => 
                    <Slide 
                        item={item} 
                        clickChioce={click_choice} 
                        goNext={goToNextSlide} 
                        point={point}
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
    fontSize: 10,
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