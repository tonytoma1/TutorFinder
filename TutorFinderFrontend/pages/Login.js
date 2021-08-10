import NavigationBar from '../components/NavigationBar';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const LoginPage = () => {
    return(
        <View style={styles.wrapper}>
            <View style={styles.loginContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input}/>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input}/>
                <TouchableOpacity title="Sign In" style={styles.button}>
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