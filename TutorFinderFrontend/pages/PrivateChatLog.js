import React from 'react';
import { TextInput } from 'react-native';
import { ScrollView, Text, View, Image, StyleSheet, Button } from 'react-native';

function PrivateChatLog({route}) {
    // The user that is going to recieve the instant messages.
    const recipientUser = route.params.user;

    return(
        <View style={styles.entireChatContainer}>
            <View style={styles.profileContainer}>
                <Image style={styles.profilePicture}source={{uri: recipientUser.profilePicture}}/>
                <Text>{recipientUser.firstName} {recipientUser.lastName}</Text>
            </View>
            <ScrollView style={styles.chatLog}>

            </ScrollView>
            <View style={styles.sendChatContainer}>
                <TextInput style={styles.chatInput}/>
                <Button title="Send" style={styles.chatButton}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    entireChatContainer: {
        flex: 1
    },
    profileContainer: {
        flexDirection: "row"
    },
    profilePicture: {
        height: 60,
        width: 60,
        borderRadius: 100
    },
    chatLog: {
        flex: 2,
        backgroundColor: 'blue'
    },
    chatInput: {
        width: '100%',
        borderColor: 'black',
        borderWidth: 1,
        flexDirection: 'column',
        flex: 5
    },
    sendChatContainer: {
        flexDirection: 'row'
    },
    chatButton: {
        flexDirection: 'column',
        flex: 1
    }
})


export default PrivateChatLog;