import React, { useEffect,useState, useRef } from 'react';
import { TextInput } from 'react-native';
import { ScrollView, Text, View, Image, StyleSheet, Button } from 'react-native';
import {useConversationContext} from '../context/ConversationContext';

function PrivateChatLog({route}) {
    const [chatLog, setChatLog] = useState([]);
    const [chatMessage, setChatMessage] = useState([]);
    const [senderEmail, setSenderEmail] = useState('');
    const socket = route.params.socket;
    const [conversations, setConversations] = useConversationContext();
    // The user that is going to recieve the instant messages.
    const recipientUser = route.params.user;
    const scrollViewRef = useRef();
    

    useEffect(() => {
        // This is the user that is currently logged in.
        setSenderEmail(socket.auth.username);
        let recipientsEmail = [recipientUser.email, socket.auth.username]
        // Get the private messages that only pertain to the recipient and to the user that is logged in.
        let messagesFound = conversations.filter((chat) => {
            return (recipientsEmail.indexOf(chat.recipients[0].email) >= 0 && recipientsEmail.indexOf(chat.recipients[1].email) >= 0)
        })
        setChatLog(messagesFound)

    }, [conversations])


    const sendPrivateMessage = () => {
        let messageContent = {
            recipientEmail: recipientUser.email,
            senderEmail: senderEmail,
            message: chatMessage
        }
        
        socket.emit('message_sent', messageContent);
    }


    return(
        <View style={styles.entireChatContainer}>
            <View style={styles.profileContainer}>
                <Image style={styles.profilePicture}source={{uri: recipientUser.profilePicture}}/>
                <Text>{recipientUser.firstName} {recipientUser.lastName}</Text>
            </View>
            <ScrollView style={styles.chatLog} ref={scrollViewRef} onContentSizeChange={(width, height) => {
                    scrollViewRef.current.scrollToEnd({animated: true});
            }}>
                {chatLog.map((element, index) => {
                    {
                        return (
                            element.messages.map((singleMessage, i) => {
                                return (
                                    <View key={i}>
                                        <Image source={{ uri: singleMessage.fromUser.profilePicture }} />
                                        <Text>{singleMessage.date}</Text>
                                        <Text>{singleMessage.message}</Text>
                                    </View>
                                )
                            })
                        )
                    }
                })}
            </ScrollView>
            <View style={styles.sendChatContainer}>
                <TextInput style={styles.chatInput} onChangeText={setChatMessage}/>
                <Button title="Send" style={styles.chatButton} onPress={() => sendPrivateMessage()} />
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