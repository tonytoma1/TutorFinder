import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, RESET_PASSWORD_EMAIL, PASSWORD_RESET_PIN} from  "@env";
import { validate } from 'validate.js';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';


/**
 * This page compares the user entered pin with the pin that is in the user's account.
 * If the pins are correct, then the user can change his password.
 */
export default function PasswordPin({route, navigation}) {
    const [passwordPin, setPasswordPin] = useState();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const constraints = {
        passwordPin: {
            presence: true
        }
    }
    
    useEffect( async () => {
        let storedEmail = await AsyncStorage.getItem(RESET_PASSWORD_EMAIL);
        setEmail(storedEmail);
    }, [])

    const checkPin = async () => {
        const url = API_URL + `api/account/password-pin/${email}/${passwordPin}`
        let isPinCorrect = false;
        let error = null;
        try {
            let response = await axios.post(url);
            if(response.status == 200) {
                isPinCorrect = true;
                await AsyncStorage.setItem(PASSWORD_RESET_PIN, passwordPin);
            }
        }
        catch(err) {
            error = err;
        }

        return {isPinCorrect: isPinCorrect, errors: error}
    }

    const validateForm = () => {
        let data = {passwordPin: passwordPin};
        let valid = false;
        let result = validate(data, constraints);
        if(result == undefined) {
            valid = true;
        }
        else {
            setErrors(result);
        }
        return valid;
    }

    function DisplayErrors() {      
        if (Object.keys(errors).length == 0) {
            return;
        }
        return(
            Object.keys(errors).map((key, index) => {
                return <Text style={styles.error}>{'\u2B24'} {errors[key]}</Text>
            })
            
        )
    }

    const handleSubmit = async () => {
        setLoading(true);
        let isValid = validateForm();
        let result;
        if (isValid) {
            result = await checkPin();
            if(result.isPinCorrect) {
                navigation.navigate('PasswordReset');
            }
            else {
                setErrors( result.errors.response.data)
            }
        }
        setLoading(false);
    }

    return(
        <View>
            <Spinner visible={loading} />
            {Object.keys(errors).length != 0 ? <DisplayErrors /> : null}
            <Text style={styles.label}>Enter Pin</Text>
                <TextInput style={styles.input} onChangeText={val => setPasswordPin(val)} value={passwordPin}/>
                <TouchableOpacity title="Recover" style={styles.button} onPress={async () => await handleSubmit()}>
                    <Text style={styles.buttonText}>Send Reset Password Link</Text>
                </TouchableOpacity>
                <Pressable title="Cancel" style={styles.cancelButton} 
                                          onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    content: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    label: {
        width: '80%',
        marginRight: 'auto',
        marginLeft: 'auto'
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
    cancelButton: {
        width: '80%',
        borderWidth: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20,
        borderColor: '#11C281',
        padding: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
    cancelText: {
        textAlign: 'center'
    },
    error: {
        textAlign: 'center',
        marginBottom: 20
    }
 
   
})