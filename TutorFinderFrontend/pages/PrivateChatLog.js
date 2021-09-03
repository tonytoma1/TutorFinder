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
                    <View key={element._id}>
                        <Image source={{ uri: element.fromUser.profilePicture }} />
                        <Text>{element.date}</Text>
                        <Text>{element.message}</Text>
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

            <FlatList style={styles.chatLog} data={chatLog} renderItem={displayChat} 
                      extraData={refresh} ref={flatListRef}
                      onContentSizeChange={() => flatListRef.current.scrollToEnd({animated: false})}
                      onLayout={() => flatListRef.current.scrollToEnd({animated: false})}/>

            <View style={styles.sendChatContainer}>
                    <TextInput style={styles.chatInput} onChangeText={setChatMessage} value={chatMessage}
                    ref={textInputRef}/>
                    <Button title="Send" style={styles.chatButton} onPress={() => sendPrivateMessage()} />
            </View>            
        </KeyboardAvoidingView>
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