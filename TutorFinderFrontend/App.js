import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationBar from './components/NavigationBar';
import Login from './pages/Login';
import TutorList from './pages/TutorList';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {AuthenticationContextProvider} from './context/AuthenticationContext';
const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="Tutor" component={TutorList} />
    </Tab.Navigator>
  )
}

const App = () => {


  return (
    <AuthenticationContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
         {/* <Stack.Screen name="Home" component={Login} options={{headerShown: false}}/> */}
          <Stack.Screen name="Main" component={MainTabs}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>  
    </AuthenticationContextProvider>
  );
};



export default App;
