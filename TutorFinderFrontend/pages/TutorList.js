import {View, Text,StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL} from '@env';

function TutorList () {
    const [tutors, setTutors] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(async () => {
        const tutors = await loadAllTutors();
        setTutors(tutors.data.tutors);
        setLoading(false);

    },[])

    if(loading) {
        return (
            <Text>Loading...</Text>
        )
    }

    return (
            <View style={styles.container}>
              <FlatList data={tutors} 
              renderItem={({item}) => 
                        <TouchableOpacity style={styles.tutorContainer}>
                            <View style={styles.image}>
                            <Image style={styles.profileImage} source={{uri: item.profilePicture}} />
                            </View>

                            <View style={styles.tutorInfo}>
                                <Text style={styles.name, styles.name}>{item.firstName} {item.lastName}</Text>
                                {item.accountType.jobTitle != null ? <Text>{item.accountType.jobTitle}</Text> : null }
                                <Text>{item.email}</Text>
                                <Text>${item.accountType.price}/hr</Text>
                                <Text>Subjects</Text>
                                <View style={styles.subjectsContainer}>
                                    {item.accountType.subjects.map((element, index) => {
                                        return (
                                            <Text style={styles.subject} key={index}>{element}</Text>
                                        )
                                    })} 
                                </View>
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
        marginBottom: 20
    },
    image: {
        flexDirection: 'column',
        marginLeft: 10,
        marginTop: 10,
    },
    profileImage: {
        borderRadius: 30,
        height: 100,
        width: 100
    },
    tutorInfo: {
        flexDirection: 'column',
        marginLeft: 10,
        marginTop: 10
    },
    subjectsContainer: {
        flexDirection: 'row'
    },
    subject: {
        marginLeft: 10
    },
    name: {
        fontSize: 20,
        fontFamily: 'Montserrat'
    }
    
})


export default TutorList;