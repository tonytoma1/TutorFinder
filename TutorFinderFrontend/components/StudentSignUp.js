import React, {useState} from 'react';
import {View, Text, TextInput, ScrollView, StyleSheet, Pressable} from 'react-native';
import { validate } from 'validate.js';
import axios from 'axios';
import {API_URL} from '@env';

function StudentSignUp ({navigation}) {
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [errors, setErrors] = useState([]);

    const constraints = {
        firstName: {
            presence: true,
            format: {
                pattern: "^[a-z]+$"
            }
        },
        lastName: {
            presence: true,
            format: {
                pattern: "^[a-z]+$"
            }
        },
        email: {
            presence: true,
            email: true
        },
        password: {
            presence: true,
            length: {minimum: 6}
        },
        confirmPassword: {
            presence: true,
            length: {minimum: 6}
        }
    } 

    const signUpStudent = async () => {
        let userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }
        let validationResult = validate(userData, constraints);

        
        // No errors are shown. Submit a request to the signup endpoint
        if (validationResult == undefined) {
            try {
               let result = await axios.post(API_URL + 'api/account/register-student', userData);
                setErrors([]);
            }
            catch(errors) {
                let registrationErrors = errors;
            }
            
        }
        else {
            // Display errors to user
            setErrors(validationResult);

        }
    }

    const DisplayErrors = () => {
        if(errors.length == 0) {
            return;
        }
        
        return (
            Object.keys(errors).map((key, index) => {
                return(
                    <Text>{errors[key]}</Text>
                )
            })
        )
    }

  return(
      <View>
        <Text>Students</Text>

        <View>
            {errors.length != 0 ?  <DisplayErrors/>: null}
        </View>
        
        <View style={[styles.row, styles.inputContainer]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} onChangeText={(val) => setFirstName(val)}/>
        </View>
        
        <View style={[styles.row, styles.inputContainer]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} onChangeText={(val) => setLastName(val)} />
        </View>

        <View style={[styles.row, styles.inputContainer]}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} onChangeText={(val) => setEmail(val)}/>
        </View>

        <View style={[styles.row, styles.inputContainer]}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} onChangeText={(val) => setPassword(val)}/>
        </View>
        
        <View style={[styles.row, styles.inputContainer]}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput style={styles.input} onChangeText={(val) => setConfirmPassword(val)}/>
        </View>

        <View  style={styles.row}>
            <Pressable style={styles.submitButton} onPress={async () => {await signUpStudent()}}>
                <Text style={styles.submitText}>Sign Up</Text>
            </Pressable>
        </View>
        
  
            <View style={styles.row}>
                <Pressable onPress={() => {navigation.navigate('Home')}} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
            </View>
      </View>
  )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    tutorInput: {
        width: '100%',
        height: 50,
        borderWidth: 1,

    },
    input: {
        borderWidth: 1,
        width: '70%'
    },
    label: {
        width: 80,
        margin: 10
    },
    inputContainer: {
        marginTop: 10
    },

    submitButton: {
        width: '90%',
        marginTop: 40,
        marginRight: 'auto',
        marginLeft: 'auto',
        borderWidth: 1,
        borderColor: '#11C281',
        backgroundColor: '#11C281',
        padding: 10
    },
    submitText: {
        textAlign: 'center',
        color: 'white'
    },
    cancelButton: {
        width: '90%',
        marginTop: 40,
        marginRight: 'auto',
        marginLeft: 'auto',
        borderWidth: 1,
        borderColor: '#11C281',
        padding: 10
    },
    cancelText: {
        textAlign: 'center'
    },
    tutorRegisterContainer: {
        
    },
    commonSubjects: {
        width: '90%',
        backgroundColor: 'grey'
    },
    subjectSelected: {
        marginRight: 10,
        borderWidth: 2,
        height: 25,
        paddingRight: 5,
        paddingLeft: 5,
        marginTop: 10,
        borderRadius: 10,
        textAlign: 'center',
        borderColor: '#11C281'
    },
    subjectTaughtContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1
    },
    subjectText: {
        marginRight: 10
    },
    signUpButton: {
        width: '90%',
        marginBottom: 15,
        marginRight: 'auto',
        marginLeft: 'auto',
        height: 40,
    },
    buttonMain: {
        backgroundColor: '#11C281',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#11C281'
    },
    centerText: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto'
    }
})


module.exports={StudentSignUp}