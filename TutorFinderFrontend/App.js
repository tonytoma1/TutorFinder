import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {AppState } from 'react-native';
import Login from './pages/Login';
import TutorList from './pages/TutorList';
import Profile from './pages/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthenticationProvider } from './AuthenticationContext';
import {ConversationProvider} from './context/ConversationContext';
import {AccountContextProvider} from './context/AccountContext';
import {SocketContextProvider} from './context/SocketContext';
import ConversationContainer from './pages/ConversationContainer';
import PrivateChatLog from './pages/PrivateChatLog';
import { Register } from './pages/Register'
import { Settings } from './pages/Settings'
import { EditStudentProfile } from './pages/EditStudentProfile'
import { EditTutorProfile } from './pages/EditTutorProfile'
import RecoverAccount from './pages/RecoverAccount';
import PasswordPin from './pages/PasswordPin';
import { PasswordReset } from './pages/PasswordReset';
import {useSocketContext} from './context/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, REFRESH_TOKEN_STORAGE_KEY, ACCESS_TOKEN_STORAGE_KEY, WEBSOCKET_URL,
  ACCOUNT_KEY } from "@env";
const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const App = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(async () => {
     AppState.addEventListener("change", async (state) => {
      let account = await getAccount();
      if (state == "background"){
        // disconnect websocket
        if(account != null) {
          console.log(account.id)
          socket.close(account.id);
          
        }    
      }
      if (state == "active") {
        // check if the user was previously logged in
        // If the user was logged in then connect to websocket server
        if(account != null) {
          setSignedIn(true);
        }
      }
    })
  
  }, [])
  
  const getAccount = async () => {
    let account = null;
    try {
      account = await AsyncStorage.getItem(ACCOUNT_KEY)
      if(account != null) {
        account = JSON.parse(account);
      }
    }
    catch(error) {
      account = null;
    }

    return account;
  }

  const MainTabs = () => {
    return (
      <Tab.Navigator screenOptions={() => ({
        tabBarIndicatorStyle: { backgroundColor: '#11C281' },
        tabBarLabelStyle: { fontFamily: 'Montserrat' }
      })
      }>
        <Tab.Screen name="Tutor" component={TutorList} />
        <Tab.Screen name="Conversations" component={ConversationContainer} />
        <Tab.Screen name="Settings" component={SettingsTab} />
      </Tab.Navigator>
    )
  }

  const SettingsTab = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Settings" component={Settings} initialParams={{
          signedIn: signedIn,
          setSignedIn: setSignedIn
        }} />
        <Stack.Screen name="EditStudent" component={EditStudentProfile} />
        <Stack.Screen name="EditTutor" component={EditTutorProfile} />
      </Stack.Navigator>
    )
  }

  const NotLoggedInPages = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Login} options={{ headerShown: false }} initialParams={{
          signedIn: signedIn,
          setSignedIn: setSignedIn
        }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="RecoverAccount" component={RecoverAccount} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordPin" component={PasswordPin} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordReset" component={PasswordReset} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <ConversationProvider>
        <AccountContextProvider>
          <AuthenticationProvider>
            <SocketContextProvider>
              <Stack.Navigator>
                {signedIn ? (
                  <>
                    <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="PrivateChat" component={PrivateChatLog} initialParams={{socket: socket, setSocket: setSocket}}/>
                  </>) :
                  (<Stack.Screen name="NotLoggedIn" component={NotLoggedInPages} options={{ headerShown: false }} />)
                }
              </Stack.Navigator>
            </SocketContextProvider>
          </AuthenticationProvider>
        </AccountContextProvider>
      </ConversationProvider>
    </NavigationContainer>

  );

};



export default App;
