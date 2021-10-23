import NavigationBar from '../components/Header';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image,
KeyboardAvoidingView} from 'react-native';
import React from 'react';
import {useState} from 'react'
import axios from 'axios';
import { API_URL, REFRESH_TOKEN_STORAGE_KEY, ACCESS_TOKEN_STORAGE_KEY } from  "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import {useAuthenticationContext} from '../AuthenticationContext';
import Logo from '../components/Header';
import {useAccountContext} from '../context/AccountContext';
import { validate } from 'validate.js';
import { Link } from '@react-navigation/native';

const LoginPage = ({navigation, route}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const authentication = useAuthenticationContext();
    const [account, setAccount] = useAccountContext();
    const [errorMessage, setErrorMessage] = useState({});

    const constraints = {
        email: {
            presence: true,
            email: true
        },
        password: {
            presence: true
        }
    }

    const loginButtonHandler = async () => {
        let result = verifyConstraints();
        if(result) {
            await login(email, password);
        }
    }

    /**
     * Checks if the login credentials are in a valid format
     * @returns Boolean indicating if the login credentials are in valid format
     */
    const verifyConstraints = () => {
        let valid = false;
        let userData = {
            email: email,
            password: password
        }
        let result = validate(userData, constraints)

        if(result == undefined) {
            valid = true;
        }
        else {
            setErrorMessage(result);
        }

        return valid;

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
            await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, authentication.refreshToken);
            await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authentication.accessToken);

            route.params.socket.auth.username = email;
            route.params.socket.connect();
            route.params.setSignedIn(true);
        }
        catch(error) {
            let result =  {message: 'Incorrect email or password'}
            setErrorMessage(result);
        }
    }

    function DisplayErrors() {
        
        if (errorMessage.length == 0) {
            return;
        }
        
        return(
            Object.keys(errorMessage).map((key, index) => {
                return <Text style={styles.error}>{'\u2B24'} {errorMessage[key]}</Text>
            })
            
        )
    }

    return(
        <View style={styles.wrapper}>
            <KeyboardAvoidingView>
            <Image style={styles.logo} source={require('../images/logo-large.png')} />
            {errorMessage.length != 0 ? <DisplayErrors/> : null}
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} onChangeText={setEmail} value={email} />
            <Text style={styles.label}>Password</Text>
            <TextInput secureTextEntry={true} style={styles.input} onChangeText={setPassword} value={password} />
            <TouchableOpacity title="Sign In" style={styles.button} onPress={loginButtonHandler}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
             {route.params.message ? <Text style={styles.successMessage}>{route.params.message}</Text> : null}
            <Link style={styles.register} to={{screen: "Register"}}>
                Don't have an account? Register here
            </Link>
            </KeyboardAvoidingView>
          
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
    },
    successMessage: {
        textAlign: 'center',
        marginTop: 60,
        fontSize: 18,
        color: 'green',
        textDecorationLine: 'underline'
    },
    error: {
        textAlign: 'center'
    }
 
})

export default LoginPage;