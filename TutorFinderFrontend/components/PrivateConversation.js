import React, {useState, useRef, useEffect} from 'react'
import {FlatList, ScrollView, View, Text, StyleSheet, Image} from 'react-native'
import {useConversationContext} from '../context/ConversationContext';

// This displays the private conversation that is happening between two users
const PrivateConversation = ({recipient, senderEmail, socket}) => {
    const [conversations, setConversations] = useConversationContext();
    const [chat, setChat] = useState([])
    const [refresh, setRefresh] = useState(false);
    const flatListRef = useRef();
    const textInputRef = useRef();

    const filterMessages = () => {
        let recipientsEmail = [recipient.email, senderEmail]
        return conversations.filter((chat) => {
            return (recipientsEmail.indexOf(chat.recipients[0].email) >= 0 && recipientsEmail.indexOf(chat.recipients[1].email) >= 0)
        });
    }

    useEffect(() => {
        setChat(filterMessages());
        socket.on("message_received", (message) => {
            // The chat state object doesn't persist after referesh. Therefore, we must reload the conversation
            // from the conversation context
            let privateConversation = filterMessages();
            privateConversation[0].messages.push(message)
            setChat(privateConversation);
            setRefresh(!refresh)
        })
    }, [])

    const displayMessage = ({item}) => {
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
                                */ }
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
       
             <FlatList style={styles.chatLog} data={chat} renderItem={displayMessage} key="list"
            extraData={refresh} ref={flatListRef}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({animated: false})}
            onLayout={() => flatListRef.current.scrollToEnd({animated: false})}/>
        

        
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

module.exports = {PrivateConversation}