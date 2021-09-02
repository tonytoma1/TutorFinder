import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {useConversationContext} from '../context/ConversationContext';

function ConversationList({route, navigation}) {
    const [conversations, setConversations] = useConversationContext();
    const socket = route.params.socket

    useEffect(() => {
     
    }, [conversations])

    const displayPrivateChat = (user, privateChat) => {
        navigation.navigate('PrivateChat', {user: user});
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
                            if(recipient.email != socket.auth.username) {
                                return (
                                    <TouchableOpacity onPress={() => displayPrivateChat(recipient, element)} >
                                        <View style={styles.recipientContainer}>
                                            <Image style={styles.recipientImage} source={{uri: recipient.profilePicture}}/>
                                            <Text style={styles.recipientName}>{recipient.firstName} {recipient.lastName}</Text>
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
        borderBottomWidth: 1
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
    }

})



export default ConversationList;