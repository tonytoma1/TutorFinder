import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native';
import {View, Text,StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';


function Profile({route, navigation}) {
    const user = route.params.profile;

    const startChat = (user) => {
        navigation.navigate("PrivateChat", {recipient: user})
    }

    return(
            <View style={styles.container}>

                {/* General Info about the tutor */}
                <View style={styles.tutorContainer}>

                    {/* Profile picture column */}
                    <View style={styles.imageContainer}>
                        <Image style={styles.profilePicture} source={{uri: user.profilePicture}} />
                    </View>    

                    {/* Tutor information column */}
                    <View style={styles.profileContainer}>
                        <Text style={[styles.defaultFont, styles.tutorFullName]}>{user.firstName} {user.lastName}</Text>
                        {user.accountType != null ? <Text style={[styles.defaultFont, styles.jobTitle]}>{user.accountType.jobTitle}</Text> : ''}
                        {/* Loop through the tutor's subjects */}
                        <View style={styles.subjectContainer}>
                        {user.accountType.subjects.map((item, index) => {
                            return (
                                    <Text key={index} style={[styles.subject, styles.defaultFont]}>{item}</Text>
                            )
                        })}
                        </View>
                        <Text style={[styles.defaultFont, styles.tutorEmail]}>{user.email}</Text>
                        <Text style={[styles.defaultFont, styles.tutorPrice]}>${user.accountType.price}/hr</Text>
                        <View style={styles.row}>
                            <Pressable style={styles.startChatButton} onPress={() => startChat(user)}>
                                <Text style={styles.profileButtonText}>Message {user.firstName}</Text>
                            </Pressable>
                        </View>
                    </View> 
                </View>

                {/* Tutor's description */}
                <ScrollView style={styles.aboutMeContainer}>
                    <Text style={[styles.aboutMeTitle, styles.defaultFont]}>About Me</Text>

                </ScrollView>

            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tutorContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#11C281',
        paddingLeft: 10,
        paddingTop: 10
    },
    row: {
        flexDirection: 'row'
    },
    imageContainer: {
        flexDirection: "column"
    },
    tutorFullName: {
        fontSize: 20,
        marginBottom: 10
    },
    profileContainer: {
        flexDirection: "column",
        marginLeft: 20
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 20
    },
    subjectContainer: {
        flexDirection: "row",
        marginBottom: 10
    },
    jobTitle: {
        marginBottom: 10
    },
    subject: {
        flexWrap: "wrap",
        marginRight: 10,
        borderWidth: 1,
        padding: 4,
        borderRadius: 10,
        borderColor: '#11C281'
    },
    startChatButton: {
        backgroundColor: '#11C281',
        borderRadius: 10,
        marginTop: 10,
        width: 150,
        marginBottom: 10
    },
    profileButtonText: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        color: 'white'
    },
    defaultFont: {
        fontFamily: 'Montserrat'
    },
    tutorEmail: {
        marginBottom: 10
    },
    tutorPrice: {
        fontSize: 18,
        marginBottom: 10
    },
    aboutMeTitle: {
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    aboutMeContainer: {
        paddingLeft: 10,
        paddingTop: 10
    }
    

    
})


export default Profile;