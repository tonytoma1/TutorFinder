import React, { useEffect,useState, useRef } from 'react';
import { TextInput } from 'react-native';
import { ScrollView, Text, View, Image, StyleSheet, Button, Keyboard,KeyboardAvoidingView } from 'react-native';
import {useConversationContext} from '../context/ConversationContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import {Header} from '@react-navigation/stack'
import { FlatList } from 'react-native-gesture-handler';

function PrivateChatLog({route}) {
    const [chatLog, setChatLog] = useState([]);
    const [chatMessage, setChatMessage] = useState([]);
    const [senderEmail, setSenderEmail] = useState('');
    const [refresh, setRefresh] = useState(false);
    const socket = route.params.socket;
    const [conversations, setConversations] = useConversationContext();
    // The user that is going to recieve the instant messages.
    const recipientUser = route.params.user;
    const flatListRef = useRef();
    const textInputRef = useRef();
    

    useEffect(() => {
        // This is the user that is currently logged in.
        setSenderEmail(socket.auth.username);
        let recipientsEmail = [recipientUser.email, socket.auth.username]
        // Get the private messages that only pertain to the recipient and to the user that is logged in.
        let messagesFound = conversations.filter((chat) => {
            return (recipientsEmail.indexOf(chat.recipients[0].email) >= 0 && recipientsEmail.indexOf(chat.recipients[1].email) >= 0)
        })
        setChatLog(messagesFound)
        setRefresh(!refresh);

    }, [conversations])


    const sendPrivateMessage = () => {
        let messageContent = {
            recipientEmail: recipientUser.email,
            senderEmail: senderEmail,
            message: chatMessage
        }

        setChatMessage('');        
        socket.emit('message_sent', messageContent);
    }

    const displayChat = ({item}) => {
        return (
            item.messages.map((element, index) => {
                return(
                    <View style={styles.chatBubble} key={element._id}>
                        <View style={styles.profilePictureContainer}>
                            {element.fromUser.email != socket.auth.username ? <Image style={styles.profilePicture} source={{ uri: element.fromUser.profilePicture }} /> : <Image />}
                        </View>
                        <View style={styles.chatContainer}>
                            <View style={styles.dateContainer}>
                                <View style={styles.leftChat}>
                                    {element.fromUser.email == socket.auth.username ? <Text></Text> : <Text>{element.date}</Text>}
                                </View>
                                <View style={styles.rightChat}>
                                    {element.fromUser.email == socket.auth.username ? <Text>{element.date}</Text> : <Text></Text>}
                                </View>
                            </View>
                            <View style={styles.messageContainer}>
                                {/*
                                    If the fromUser is from the user that is currently logged in,
                                    then display the message on the right column. Otherwise,
                                    the message was sent from the other person, so display the message
                                    on the left column.
                                */}
                                    <View style={styles.leftChat}>
                                        {element.fromUser.email != socket.auth.username ? <Text style={[styles.rightChatContent, styles.chatContent]}>{element.message}</Text> : <Text></Text>}
                                    </View>
                                    <View style={styles.rightChat}>
                                        {element.fromUser.email == socket.auth.username ? <Text style={[styles.leftChatContent, styles.chatContent]}>{element.message}</Text> : <Text></Text>}
                                    </View>
                            </View>
                        </View>
                    </View>
                )
            })
        )
    }

    return(
        <KeyboardAvoidingView style={styles.entireChatContainer} behavior="padding"
        keyboardVerticalOffset={-500}>
            <View style={styles.profileContainer}>
                <Image style={styles.profilePicture}source={{uri: recipientUser.profilePicture}}/>
                <Text>{recipientUser.firstName} {recipientUser.lastName}</Text>
            </View>

            <FlatList style={styles.chatLog} data={chatLog} renderItem={displayChat} key="list"
            extraData={refresh} ref={flatListRef}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({animated: false})}
            onLayout={() => flatListRef.current.scrollToEnd({animated: false})}/>

            <View style={styles.sendChatContainer}>
                    <TextInput style={styles.chatInput} onChangeText={setChatMessage} value={chatMessage}
                    ref={textInputRef}  key={"message"} />
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