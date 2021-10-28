import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, StyleSheet, TextInput} from 'react-native';

/**
 * This page compares the user entered pin with the pin that is in the user's account.
 * If the pins are correct, then the user can change his password.
 */
export default function PasswordPin({route, navigation}) {
    const [passwordPin, setPasswordPin] = useState('');
    const [email, setEmail] = useState('')

    useEffect(() => {
        setEmail(route.params.email)
    }, [])

    return(
        <View>
            <Text style={styles.label}>Enter Pin</Text>
                <TextInput style={styles.input} onChangeText={val => setPasswordPin(val)} value={passwordPin}/>
                <TouchableOpacity title="Recover" style={styles.button} onPress={async () => await buttonHandler()}>
                    <Text style={styles.buttonText}>Send Recovery Email</Text>
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