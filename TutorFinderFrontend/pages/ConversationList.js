import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {useConversationContext} from '../context/ConversationContext';
import {useSocketContext} from '../context/SocketContext';
import {useAccountContext} from '../context/AccountContext';
import * as SocketConstants from '../constants/websocket-constants';

function ConversationList({route, navigation}) {
    const [conversations, setConversations] = useConversationContext();
    const [socket, setSocket] = useSocketContext();
    const [account, setAccount] = useAccountContext();

    useEffect(() => {
         // Load all of the conversations the user has
         socket.onmessage = (event) => {
            let message = JSON.parse(event.data)
            switch(message.type) {
                case SocketConstants.CONVERSATIONS_LIST:
                    setConversations(message.data);
                    break;
                case SocketConstants.PRIVATE_MESSAGE: 
                    // TODO recieve message
                    updateConversationList(message.data);
                    break;
            }
         }
    }, [])

    const updateConversationList = () => {

    }

    const displayPrivateChat = (user, privateChat) => {
        navigation.navigate('PrivateChat', {recipient: user});
    }

    if(conversations != null && conversations != undefined  && conversations.length != 0 ) {
        return(
            <View>
                <ScrollView>
                    {conversations.map((element, index) => {  
                        return(
                        //Loop through the recipients array
                        element.recipients.map((recipient, indexOfRecipient) => {
                            /* Don't display the user that is currently logged in 
                            as a recipient of the conversation. */
                            if(recipient._id != account._id) {
                                return (
                                    <TouchableOpacity style={styles.conversationButton} onPress={() => displayPrivateChat(recipient, element)} >
                                        <View style={styles.recipientContainer}>
                                            <View style={styles.col}>
                                                <Image style={styles.recipientImage} source={{uri: recipient.profilePicture}}/>
                                            </View>
                                            <View style={[styles.col, styles.messageContent]}>
                                                <Text style={styles.recipientName}>{recipient.firstName} {recipient.lastName}</Text>
                                                <Text style={styles.messageBox}>
                                                    {element.messages[element.messages.length - 1].fromUser.email == account.email ?
                                                    <Text >(you): </Text> : <Text>{element.messages[element.messages.length - 1].fromUser.firstName}: </Text>}
                                                    <Text >{element.messages[element.messages.length - 1].message} </Text>                 
                                                </Text>
                                            </View>
                                                                                     
                                        </View>
                                        <View style={styles.latestMessage}>
                                          
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        })
                        )
                    })}
                </ScrollView>
            </View>
        )
    }


    return (
        <View>
            <Text>No conversations </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    recipientContainer: {
        flexDirection: "row",
        borderBottomColor: 'black',
    },
    recipientImage: {
        width: 80,
        height: 80,
        borderRadius: 100
    },
    recipientName: {
        textAlignVertical: 'center',
        marginLeft: 10,
        fontSize: 25
    },
    latestMessage: {
        flexDirection: 'row',
        alignContent: 'center'
    },
    conversationButton: {
        borderBottomWidth: 1,
        borderBottomColor: '#11C281',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 10
    },
    col: {
        flexDirection: 'column'
    },
    messageContent: {
        marginTop: 10
    },
    messageBox: {
        marginLeft: 10
    }

})



export default ConversationList;