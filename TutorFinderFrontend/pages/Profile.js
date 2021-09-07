import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { ScrollView } from 'react-native';
import {View, Text,StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';


function Profile({route, navigation}) {
    const user = route.params.profile;
    const socket = route.params.socket;

    const startChat = (user) => {
        let recipient = user;
        let sender = socket.auth.username;
        navigation.navigate("PrivateChat", {user: user})
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
                        <Text>{user.firstName} {user.lastName}</Text>
                        {user.accountType != null ? <Text>{user.accountType.jobTitle}</Text> : ''}
                        {/* Loop through the tutor's subjects */}
                        <View style={styles.subjectContainer}>
                        {user.accountType.subjects.map((item, index) => {
                            return (
                                    <Text key={index} style={styles.subject}>{item}</Text>
                            )
                        })}
                        </View>
                        <Text>{user.email}</Text>
                        <Pressable style={styles.startChatButton} onPress={() => startChat(user)}
                        ><Text>Message {user.firstName}</Text></Pressable>
                    </View> 
                </View>

                {/* Tutor's description */}
                <ScrollView>

                </ScrollView>

            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tutorContainer: {
        flexDirection: "row"
    }
    ,
    imageContainer: {
        flexDirection: "column"
    },
    profileContainer: {
        flexDirection: "column"
    },
    profilePicture: {
        width: 100,
        height: 100
    },
    subjectContainer: {
        flexDirection: "row"
    },
    subject: {
        flexWrap: "wrap"
    },
    startChatButton: {
        backgroundColor: 'gray',
        marginLeft: 10,
        marginTop: 10
    }
})


export default Profile;