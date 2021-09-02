import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationBar from './components/NavigationBar';
import Login from './pages/Login';
import TutorList from './pages/TutorList';
import Profile from './pages/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {AuthenticationProvider} from './AuthenticationContext';
import {API_URL} from '@env';
import io from 'socket.io-client';
import ConversationList from './pages/ConversationList';
import PrivateChatLog from './pages/PrivateChatLog';
import {ConversationProvider, useConversationContext} from './context/ConversationContext';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const App = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [conversations, setConversations] = useConversationContext();
  const [socket, setSocket] = useState(io(API_URL, {
                                        autoConnect: false,
                                        auth: {
                                            username: null,
                                            sessionId: null,
                                            userId: null
                                        }}));

  useEffect(() => {
     // Load all of the conversations the user has
     socket.on('conversations_list', (userConversations) => {
      setConversations(userConversations);
    })
    socket.on("message_received", (newConversationsList) => {
      setConversations(newConversationsList);
    })
  }, [socket])

  const MainTabs = () => {
    return (
      <Tab.Navigator>
          <Tab.Screen name="Tutor" component={TutorList} />
          <Tab.Screen name="Conversations" initialParams={{socket: socket}} component={ConversationList}/>
      </Tab.Navigator>
    )
  }

  return (
    
      <NavigationContainer>
        <AuthenticationProvider>
          <Stack.Navigator>
            {signedIn ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Profile" component={Profile} initialParams={{ socket: socket }} />
                <Stack.Screen name="PrivateChat" component={PrivateChatLog} initialParams={{ socket: socket}} />
              </>) :
              (<Stack.Screen name="Home" component={Login} options={{ headerShown: false }} initialParams={{
                signedIn: signedIn,
                setSignedIn: setSignedIn,
                socket: socket
              }} />)
            }
          </Stack.Navigator>
        </AuthenticationProvider>
      </NavigationContainer>
  
  );
  
};



export default App;
