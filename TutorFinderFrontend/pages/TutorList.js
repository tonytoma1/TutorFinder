import {View, Text,StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL} from '@env';
import {useAuthenticationContext} from '../AuthenticationContext';

function TutorList ({navigation}) {
    const [tutors, setTutors] = useState(new Array());
    const [loading, setLoading] = useState(true);
    const authentication = useAuthenticationContext();
    
    useEffect(async () => {
        try {
            const tutors = await loadAllTutors();
            setTutors(tutors.data.tutors);
        }
        catch(error) {
        }
        finally {
            setLoading(false);
        }
    },[])

    
    const loadUserProfile = async (profile) => {
        navigation.navigate("Profile", {profile: profile});
    }

    if(loading) {
        return (
            <Text>Loading...</Text>
        )
    }

    if(tutors.length == 0) {
        return (
            <View>
                <Text>No tutors to load at this time.</Text>
            </View>
        )
    }

    return (
            <View style={styles.container}>
              <FlatList data={tutors} 
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
                        </TouchableOpacity>
                }
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
        flex: 1
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

    }
    
})


export default TutorList;