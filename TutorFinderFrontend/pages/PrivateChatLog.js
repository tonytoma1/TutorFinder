import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { ScrollView, Text, View, Image, StyleSheet, Button } from 'react-native';

function PrivateChatLog({route}) {
    const [chatLog, setChatLog] = useState([]);
    const socket = route.params.socket;
    const conversations = route.params.conversations;
    // The user that is going to recieve the instant messages.
    const recipientUser = route.params.user;

    useState(() => {
        // This is the user the is currently logged in.
        let senderUsername = socket.auth.username;
        let recipientsEmail = [recipientUser.email, socket.auth.username]
        // Get the messages that are only pertain to the recipient and to the user that is logged in.
        let messages = conversations.filter((chat) => {
            return (recipientsEmail.indexOf(chat.recipients[0].email) >= 0 && recipientsEmail.indexOf(chat.recipients[1].email) >= 0)
        })
        setChatLog(messages)

    }, [chatLog, socket, conversations])

    return(
        <View style={styles.entireChatContainer}>
            <View style={styles.profileContainer}>
                <Image style={styles.profilePicture}source={{uri: recipientUser.profilePicture}}/>
                <Text>{recipientUser.firstName} {recipientUser.lastName}</Text>
            </View>
            <ScrollView style={styles.chatLog}>
                {chatLog.map((element, index) => {
                    return (
                        <View key={index}>

                        </View>
                    )
                })}
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
        backgroundColor: 'white'
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