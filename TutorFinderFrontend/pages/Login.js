import NavigationBar from '../components/Header';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useState} from 'react'
import axios from 'axios';
import { API_URL } from  "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import {useAuthenticationContext} from '../AuthenticationContext';
import Logo from '../components/Header';
import {useAccountContext} from '../context/AccountContext';
import { Link } from '@react-navigation/native';

const LoginPage = ({navigation, route}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authentication = useAuthenticationContext();
    const [account, setAccount] = useAccountContext();

    const loginButtonHandler = async () => {
        await login(email, password);
    }

    const login = async () => {
        try {
            const loginUrl = API_URL + 'api/account/login';
            const data = {email: email, password: password};
            let loginResponse = await axios.post(loginUrl, data);

            setAccount(loginResponse.data.account);
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
            <Image style={styles.logo} source={require('../images/logo-large.png')} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} onChangeText={setEmail} value={email} />
            <Text style={styles.label}>Password</Text>
            <TextInput secureTextEntry={true} style={styles.input} onChangeText={setPassword} value={password} />
            <TouchableOpacity title="Sign In" style={styles.button} onPress={loginButtonHandler}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <Link style={styles.register} to={{screen: "Register"}}>
                Don't have an account? Register here
            </Link>
            {route.params.message ? <Text>{route.params.message}</Text> : null}
        </View>
    )
}



const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    label: {
        width: '80%',
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    logo: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 200,
        height: 200
    },  
    input: {
        borderWidth: 1,
        borderColor: '#11C281',
        width: '80%',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 20
    },
    button: {
        width: '80%',
        borderWidth: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        borderColor: '#11C281',
        backgroundColor: '#11C281',
        padding: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
    register: {
        textAlign: 'center',
        marginTop: 60,
        textDecorationLine: 'underline',
        color: 'blue'
    }
 
})

export default LoginPage;