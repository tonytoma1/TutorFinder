import React, { useEffect,useState, useRef } from 'react';
import { TextInput } from 'react-native';
import { ScrollView, Text, View, Image, StyleSheet, Button, Keyboard,KeyboardAvoidingView } from 'react-native';
import {useConversationContext} from '../context/ConversationContext';
import {PrivateConversation} from '../components/PrivateConversation';
import {useSocketContext} from '../context/SocketContext';
import {useAccountContext} from '../context/AccountContext';
import {PRIVATE_MESSAGE} from '../constants/websocket-constants'

function PrivateChatLog({route}) {
    const [chatMessage, setChatMessage] = useState([]);
    const [senderId, setSenderId] = useState('');
    const [account, setAccount] = useAccountContext();
    const [socket, setSocket] = useSocketContext();
    // The user that is going to recieve the instant messages.
    const recipientUser = route.params.recipient;
    const flatListRef = useRef();
    const textInputRef = useRef();
    

    useEffect(() => {
        // This is the user that is currently logged in.
        setSenderId(account._id);

    }, [])


    const sendPrivateMessage = () => {
        let messageContent = {
            recipientId: recipientUser._id,
            recipient: recipientUser,
            sender: account,
            senderId: senderId,
            message: chatMessage
        }
        setChatMessage('');    
        let message = JSON.stringify({type: PRIVATE_MESSAGE, data: messageContent});    
        socket.send(message);
    }

    return(
        <KeyboardAvoidingView style={styles.entireChatContainer} behavior="padding"
            keyboardVerticalOffset={-500}>
            <View style={styles.profileContainer}>
                <Image style={styles.profilePicture} source={{ uri: recipientUser.profilePicture }} />
                <Text>{recipientUser.firstName} {recipientUser.lastName}</Text>
            </View>

            <PrivateConversation recipient={recipientUser} />

            <View style={styles.sendChatContainer}>
                <TextInput style={styles.chatInput} onChangeText={setChatMessage} value={chatMessage}
                    ref={textInputRef} key={"message"} />
                <Button title="Send" style={styles.chatButton} onPress={() => sendPrivateMessage()} />
            </View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    entireChatContainer: {
        flex: 1,
        width: '100%'
    },
    profileContainer: {
        flexDirection: "row"
    },
    chatLog: {
        backgroundColor: 'white',
        width: '100%',
        flex: 1
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
        flex: 1,
    },
    otherUser: {

    },
    /*Chat message styles */
    chatBubble: {
        flex: 1,
        marginBottom: 15,
        width: '100%',
        flexDirection: 'row'
    
    },
    profilePicture: {
        height: 40,
        width: 40,
        borderRadius: 100,
    },
    profilePictureContainer: {
        flexDirection: 'column',
        width: '10%'
    },
    chatContainer: {
        flexDirection: 'column',
        width: '90%'
        
    },
    chatMessage: {        
        backgroundColor: 'blue',
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5,
        color: 'white',
        borderRadius: 10,
    },
    dateContainer: {
        flexDirection: 'row'
    },
    messageContainer: {
        flexDirection: 'row'
    },
    leftChat: {
        flexDirection: 'column',
        width: '50%'
    },
    rightChat: {
        flexDirection: 'column',
        width: '50%',
    },
    leftChatContent: {
        textAlign: 'left',
        backgroundColor: '#A9A9A9'
    },
    rightChatContent: {
        textAlign: 'left',
        backgroundColor: '#11C281'
    },
    chatContent: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 3,
        borderRadius: 10,
        color: 'white',
        fontSize: 15
        
    }
   
})


export default PrivateChatLog;