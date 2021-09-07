import NavigationBar from '../components/NavigationBar';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useState} from 'react'
import axios from 'axios';
import { API_URL } from  "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import {useAuthenticationContext} from '../AuthenticationContext';


const LoginPage = ({navigation, route}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authentication = useAuthenticationContext();

    const loginButtonHandler = async () => {
        await login(email, password);
    }

    const login = async () => {
        try {
            const loginUrl = API_URL + 'api/account/login';
            const data = {email: email, password: password};
            let loginResponse = await axios.post(loginUrl, data);
            let cookies = await CookieManager.get(API_URL);
            authentication.refreshToken = cookies.refresh_token.value;
            authentication.accessToken = cookies.access_token.value;
            await AsyncStorage.setItem('tutor_app_refresh_token', authentication.refreshToken);
            await AsyncStorage.setItem('tutor_app_access_token', authentication.accessToken);
            route.params.socket.auth.username = email;
            route.params.socket.connect();
            route.params.setSignedIn(true);
        }
        catch(error) {
            console.debug(error);
        }
    }

    return(
        <View style={styles.wrapper}>
            <View style={styles.loginContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} onChangeText={setEmail} value={email}/>
                <Text style={styles.label}>Password</Text>
                <TextInput secureTextEntry={true} style={styles.input} onChangeText={setPassword} value={password}/>
                <TouchableOpacity title="Sign In" style={styles.button} onPress={loginButtonHandler}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'center'
       
    },

    input: {
        borderWidth: 1,
        width: '80%',
        marginRight: 'auto',
        marginLeft: 'auto'
    },

    label: {
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '80%',
        marginTop: 20
    },

    button: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#11C281',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20
    },

    buttonText: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        color: 'black',
        fontWeight: 'bold'     
    },

    
  
})

export default LoginPage;