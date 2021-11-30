import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, StyleSheet, TextInput, Label, ScrollView} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {API_URL, PASSWORD_RESET_PIN, RESET_PASSWORD_EMAIL} from "@env";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validate } from 'validate.js';


export const PasswordReset = ({navigation}) => {
    const [email, setEmail] = useState();
    const [passwordPin, setPasswordPin] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        let pin = await AsyncStorage.getItem(PASSWORD_RESET_PIN);
        let email = await AsyncStorage.getItem(RESET_PASSWORD_EMAIL);
        setEmail(email);
        setPasswordPin(pin);
    },[])

    const constraints = {
        password: {
            presence: true
        },
        confirmPassword: {
            presence: true,
        } 
    }

    const validateForm = () => {
        let data = {password: password, confirmPassword: confirmPassword};
        let valid = false;
        let result = validate(data, constraints);
        if(result == undefined) {
            if(password == confirmPassword) {
                valid = true;
            }
            else {
                setErrors({message: "Passwords don't match"});
            }
            
        }
        else {
            setErrors(result);
        }
        return valid;
    }
    
    const buttonHandler = async () => {
        setLoading(true);

        const isValid = validateForm();
        if (isValid) {
            try {
                const response = await axios.put(API_URL + `api/account/password/${email}/${passwordPin}/${password}`);
                if (response.status == 200) {
                    await AsyncStorage.multiRemove([PASSWORD_RESET_PIN, RESET_PASSWORD_EMAIL]);
                    setLoading(false);
                    navigation.navigate('Home');
                }
            }
            catch (err) {
                setErrors({ message: "Unexpected error happened. Try again" });
            }
        }

        setLoading(false);
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


    return (
        <ScrollView>
            <Spinner visible={loading} />

            {Object.keys(errors).length != 0 ? <DisplayErrors /> : null}
              <View>
                <Text style={styles.label}>Enter Password</Text>
                <TextInput secureTextEntry={true}  
                           style={styles.input} onChangeText={val => setPassword(val)} value={password}/>
              </View>
              <View>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput secureTextEntry={true} 
                         style={styles.input} onChangeText={val => setConfirmPassword(val)} value={confirmPassword}/>
              </View>
              <View>
              <TouchableOpacity title="Recover" style={styles.button} onPress={async () => await buttonHandler()}>
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
             </View>
              
        </ScrollView>
       
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