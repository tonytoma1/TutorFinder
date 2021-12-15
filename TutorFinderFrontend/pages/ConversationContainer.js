import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useConversationContext } from '../context/ConversationContext';
import { useSocketContext } from '../context/SocketContext';
import { useAccountContext } from '../context/AccountContext';
import * as SocketConstants from '../constants/websocket-constants';
import ConversationList from '../components/ConversationsList';

function ConversationContainer({ route, navigation }) {
    const [socket, setSocket] = useSocketContext();
    const [account, setAccount] = useAccountContext();


    useEffect(() => {
        socket.send(JSON.stringify({ type: SocketConstants.CONVERSATIONS_LIST }));
    
    }, [])

    return (<ConversationList navigation={navigation}/>)
}




export default ConversationContainer;