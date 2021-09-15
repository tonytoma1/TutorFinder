import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from './components/Header';
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
import {Register} from './pages/Register'
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
      <Tab.Navigator screenOptions={() => ({
        tabBarIndicatorStyle: {backgroundColor: '#11C281'},
        tabBarLabelStyle: {fontFamily: 'Montserrat'}
      })
      }>
          <Tab.Screen name="Tutor" component={TutorList} initialParams={{socket: socket}} />
          <Tab.Screen name="Conversations" initialParams={{socket: socket}} component={ConversationList}/>
      </Tab.Navigator>
    )
  }

  const NotLoggedInPages = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Login} options={{headerShown: false}} initialParams={{
                signedIn: signedIn,
                setSignedIn: setSignedIn,
                socket: socket
              }} />
         <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/> 
        </Stack.Navigator>
      )
  }

  return (
      <NavigationContainer>
        <AuthenticationProvider>
          <Stack.Navigator>
            {signedIn ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} options={{headerShown: false}}/>
                <Stack.Screen name="Profile" component={Profile} initialParams={{ socket: socket }} />
                <Stack.Screen name="PrivateChat" component={PrivateChatLog} initialParams={{ socket: socket}} />
              </>) :
              (<Stack.Screen name="NotLoggedIn" component={NotLoggedInPages} options={{headerShown: false}}/>)
            }
          </Stack.Navigator>
        </AuthenticationProvider>
      </NavigationContainer>
  
  );
  
};



export default App;
