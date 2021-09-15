import {View, Text,StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity, Pressable, Dimensions, TextInput} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {API_URL} from '@env';
import {useAuthenticationContext} from '../AuthenticationContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import SideMenu from 'react-native-side-menu'
import { ScrollView } from 'react-native-gesture-handler';
import RangeSlider from 'rn-range-slider';
import Thumb from './slider/Thumb'
import Rail from './slider/Rail'
import RailSelected from './slider/RailSelected';


function TutorList ({navigation}) {
    const [tutors, setTutors] = useState(new Array());
    const [filteredTutorList, setFilteredTutorList] = useState(new Array());
    const [loading, setLoading] = useState(true);
    const [currentPrice, setCurrentPrice] = useState(40);
    const [showFilters, setShowFilters] = useState(false);
    const authentication = useAuthenticationContext();
    
    useEffect(async () => {
        try {
            const tutors = await loadAllTutors();
            setTutors(tutors.data.tutors);
            setFilteredTutorList(tutors.data.tutors);
        }
        catch(error) {
        }
        finally {
            setLoading(false);
        }
    },[])

    useEffect(() => {
        filterList();
    }, [currentPrice])

    
    const loadUserProfile = async (profile) => {
        navigation.navigate("Profile", {profile: profile});
    }

    const filterList = () => {
        let list = tutors.filter((element) => element.accountType.price <= currentPrice)
        setFilteredTutorList(list);
    }

    const DisplayFilters = () => {
        return (
            <View style={styles.filters}>
                <View style={styles.col}>
                    <Text style={styles.priceText}>Max Price</Text>
                    <Slider style={{width: 150}} step={1}minimumValue={0} maximumValue={300} 
                    value={currentPrice} onValueChange={value => {setCurrentPrice(value)}}/>
                    <Text style={styles.priceText}>Current: ${currentPrice}</Text>

                    </View>
            </View>
        )
    }

    if(loading) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
            <View style={styles.container}>
                <View style={styles.pageOptions}>
                    <View style={styles.pageOptionsCol}>
                       
                    </View>
                    <View style={styles.pageOptionsCol}>
                        <Pressable style={styles.filterButton} onPress={() => {setShowFilters(!showFilters)}}>
                            <Text style={[styles.textFilter]}>
                                <Icon name="filter" color='#11C281' size={28}style={[styles.filter, styles.iconFilter]}/>
                                Filter
                            </Text>
                        </Pressable>
                    </View>
                </View>
                
                {showFilters ? <DisplayFilters/> : null}
                
              <FlatList data={filteredTutorList} 
              renderItem={({item}) =>
                        <TouchableOpacity style={styles.tutorContainer} onPress={() => loadUserProfile(item)}>
                            <View style={styles.image}>
                            <Image style={styles.profileImage} source={{uri: item.profilePicture}} />
                            </View>

                            <View style={styles.tutorInfo}>
                                <Text style={styles.name, styles.name}>{item.firstName} {item.lastName}</Text>
                                {item.accountType.jobTitle != null ? <Text>{item.accountType.jobTitle}</Text> : null }
                                <Text>{item.email}</Text>
                                <View style={styles.subjectsContainer}>
                                    {item.accountType.subjects.map((element, index) => {
                                        return (
                                            <Text style={styles.subject} key={index}>{element}</Text>
                                        )
                                    })} 
                                </View>
                                <Text style={styles.tutorPrice}>${item.accountType.price}/hr</Text>

                            </View>
                        </TouchableOpacity>}
                        keyExtractor={(item, index) => index.toString()}
              />
            </View>
                
    )
}
 
const loadAllTutors = async () => {
    const tutors = await axios.get(API_URL + 'api/tutor/all');
    return tutors;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tutorContainer: {
        flexDirection: 'row',
        marginBottom: 0,
        borderBottomWidth: 1,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: '#11C281',
        paddingBottom: 15,
        paddingTop: 15,
    },
    image: {
        flexDirection: 'column',
        marginLeft: 10,
        marginTop: 10,
    },
    profileImage: {
        borderRadius: 30,
        height: 90,
        width: 90,
        marginRight: 10
    },
    tutorInfo: {
        flexDirection: 'column',
        marginLeft: 10,
        marginTop: 10,
        fontFamily: 'Montserrat',

    },
    subjectsContainer: {
        flexDirection: 'row'
    },
    subject: {
        marginRight: 10,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        borderColor: '#11C281',
        marginTop: 5,
        marginBottom: 5,
        fontFamily: 'Montserrat',

    },
    name: {
        fontSize: 20,
        fontFamily: 'Montserrat',

    },
    tutorPrice: {
        fontSize: 16,
        fontFamily: 'Montserrat',

    },
    pageOptions: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15
    },
    pageOptionsCol: {
        flexDirection: 'column',
        width: '50%',
        alignItems: 'flex-end'
    },
    textFilter: {
        fontSize: 17,
        fontFamily: 'Montserrat',
        paddingLeft: 5,
        paddingRight: 5
    },
    filterButton: {
        width: '40%',
        borderWidth: 1,
        borderColor: '#11C281',
        marginRight: 10,
        borderRadius: 15
    },
    filters: {
      flexDirection: 'row',
      
    },
    sliderContainer: {
       flexDirection: 'row',
        
    },
    col: {
        flexDirection: 'column',
    },
    sliderPrice: {
        
    },
    priceInput: {
     borderWidth: 1,
     height: 40,
     width: 35
    },
    priceText: {
        marginLeft: 15
    }
    
})


export default TutorList;