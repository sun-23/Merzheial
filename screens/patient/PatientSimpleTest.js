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
        title: 'แบบคัดกรองสมรรถภาพความจำ 14 คำถาม',
        subtitle: 'คำ ชี้แจง',
        des1: 'คะแนน 1 เมื่อเหตุการณ์นั้นไม่เคยเกิดขึ้นเลยหรืออาจจะเกิดขึ้นนานๆ ครั้ง ในระยะเวลา 1 ปี',
        des2: 'คะแนน 2 เมื่อเหตุการณ์นั้นเกิดขึ้นไม่บ่อยนักหรืออาจจะเกิดขึ้น 1 หรือ 2 ครั้ง ในระยะเวลา 1 เดือน',
        des3: 'คะแนน 3 เมื่อเหตุการณ์นั้นเกิดขึ้นค่อนข้างบ่อยหรืออาจจะเกิดขึ้นเกือบทุกสัปดาห์',
        des4: 'คะแนน 4 เมื่อเหตุการณ์นั้นเกิดขึ้นเกือบทุกวัน',
        description: 'ที่มา : แปลจากบทความใน British Medical Association โดย ชาญกัญญา ตันติลีปิกร (วท.ม.จิตวิทยาคลินิก) สถาบันวิจัยและพัฒนาวิทยาศาสตร์และเทคโนโลยีมหาวิทยาลัยมหิดล และพญ.โสภา เกริกไกรกุล หน่วยประสาทวิทยา วิทยาลัยแพทยศาสตร์ กรุงเทพฯและวชิรพยาบาล',
        isTest: false,
    },
    {
        id: 1,
        title: 'หาของใช้ในบ้านไม่พบ',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 2,
        title: 'จำสถานที่ที่เคยไปบ่อยๆ ไม่ได้',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 3,
        title: 'ต้องกลับไปทบทวนงานที่แม้จะตั้งใจทำ ซํ้าถึง 2 ครั้ง',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 4,
        title: 'ลืมสิ่งของที่ตั้งใจว่าจะนำเอาออกไปนอกบ้านด้วย',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 5,
        title: 'ไม่สามารถเข้าใจเนื้อเรื่องในหนังสือพิมพ์ หรือวารสารที่อ่าน',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 6,
        title: 'ลืมเรื่องที่ได้รับฟังมาเมื่อวานนี้ หรือ เมื่อ 2-3 วันก่อน',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 7,
        title: 'ลืมบอกข้อความที่คนอื่นวานให้\nมาบอกอีกคนหนึ่ง',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 8,
        title: 'ลืมข้อมูลส่วนตัวของตนเอง เช่น วันเกิด ที่อยู่',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 9,
        title: 'สับสนในรายละเอียดของเรื่องที่ได้รับฟังมา',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 10,
        title: 'ลืมที่ที่เคยวางสิ่งของนั้นเป็นประจำ หรือ มองหาสิ่งของนั้นในที่ที่ไม่น่าจะวางไว้',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 11,
        title: 'ขณะเดินทาง หรือเดินเล่น หรืออยู่ในอาคารที่เคยไปบ่อย ๆ มักเกิดอาการหลงทิศหรือหลงทาง',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 12,
        title: 'ต้องทำกิจวัตรประจำวันบางอย่างซํ้าถึง 2 ครั้ง เพราะมีความผิดพลาดเกิดขึ้น เช่น ใส่นํ้าตาลมากเกินไปในเวลาปรุงอาหาร หรือเดินไปหวีผมซํ้าอีกครั้ง ซึ่งเมื่อซักครู่เพิ่งได้หวีผมเสร็จไป',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 13,
        title: 'เล่าเรื่องเดิมซํ้าอีกครั้งซึ่งเมื่อสักครู่เพิ่งได้เล่าเสร็จ',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 14,
        title: 'ลืมเพื่อนสนิท หรือ ญาติสนิท หรือ บุคคลที่คบหากันบ่อยๆ',
        choose_num: null,
        isTest: true, 
    },
    {
        id: 15,
        title: 'เสร็จสิ้น',
        subtitle: 'คำแนะนำ',
        isTest: false,
    },
]

const answer_type = [
    "เหตุการณ์ไม่เคยเกิดขึ้นเลยหรือเกิดขึ้นนานๆ ครั้ง ใน 1 ปี",
    "เหตุการณ์เกิดขึ้น 1 หรือ 2 ครั้ง ในระยะเวลา 1 เดือน",
    "เหตุการณ์เกิดขึ้นเกือบทุกสัปดาห์",
    "เหตุการณ์เกิดขึ้นเกือบทุกวัน"
]

const result_type = {
    a: 'สมรรถภาพทางสมองอยู่ในเกณฑ์ดีมาก',
    b: 'สมรรถภาพทางสมองอยู่ในระดับปานกลางควรเข้ารับคำแนะนำเพื่อเพิ่มสมรรถภาพทางสมอง',
    c: 'สมรรถภาพทางสมองอยู่ในระดับค่อนข้างตํ่าควรเข้ารับคำแนะนำเพื่อเพิ่มสมรรถภาพทางสมอง',
    d: 'สมรรถภาพทางสมองตํ่า ควรพบแพทย์'
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
                        ตกลง
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
                                ข้อก่อนหน้า
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
                                    ยกเลิก
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