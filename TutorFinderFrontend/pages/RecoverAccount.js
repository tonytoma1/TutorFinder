import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Pressable, StyleSheet} from 'react-native'
import { API_URL, RESET_PASSWORD_EMAIL} from  "@env";
import { validate } from 'validate.js';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecoverAccount({navigation}) {
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const constraints = {
        email: {
            presence: true,
            email: true
        }
    }

    const validateForm = () => {
        let data = {email: email};
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

    const sendRecoveryCode = async () => {
        const url = API_URL + `api/account/password-pin/${email}`
        let result;
        try {
            result = await axios.post(url);
        }
        catch(err) {
            result = 'Invalid email';
        }
        return result;
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

    const buttonHandler = async () => {
        setLoading(true);
        let isValid = validateForm();
        let result;
        if(isValid) {
            result = await sendRecoveryCode();
            if(result.status == 200) {
                await AsyncStorage.setItem(RESET_PASSWORD_EMAIL, email.toLowerCase())
                setLoading(false);
                navigation.navigate('PasswordPin', {email: email.toLowerCase()});
                return;
            }
            else {
                setErrors({error: result})
            }
        }
       setLoading(false);
    }

    return(
        <View style={styles.wrapper}>
            <Spinner  visible={loading}/>
            <View style={styles.content}>
                {Object.keys(errors).length != 0 ? <DisplayErrors/> : null}
                <Text style={styles.label}>Enter Email</Text>
                <TextInput style={styles.input} onChangeText={val => setEmail(val)} value={email}/>
                <TouchableOpacity title="Recover" style={styles.button} onPress={async () => await buttonHandler()}>
                    <Text style={styles.buttonText}>Send Recovery Email</Text>
                </TouchableOpacity>
                <Pressable title="Cancel" style={styles.cancelButton} 
                                          onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
            </View>
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
