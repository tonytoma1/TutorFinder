import React, {useState} from 'react';
import {View, Text, TextInput, ScrollView, StyleSheet, Pressable} from 'react-native';
import { validate } from 'validate.js';
import {API_URL} from '@env';
import axios from 'axios';
import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';


function StudentSignUp (props) {
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
                pattern: "^[a-zA-Z]+$"
            }
        },
        lastName: {
            presence: true,
            format: {
                pattern: "^[a-zA-Z]+$"
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

    async function signUpStudent(){
            props.setLoading(true);
            let userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
            let isValid = checkValidation(userData);

            if(isValid) {
                let url = API_URL + 'api/account/register-student'; 
                let errorFound;
                try {
                    let result = await axios.post(url, userData);
                    props.setLoading(false);
                    let message = "Account Successfully Created"
                    props.navigation.navigate('Home', {message: message});
                }
                catch(error) {
                    errorFound = error;
                    setErrors(error.response.data);
                    props.setLoading(false);
                }
            }
    }
    

    function checkValidation(userData) {
        let isValid = false;
        let validationResult = validate(userData, constraints);
        if (validationResult == undefined) {
            if(password == confirmPassword) {
                isValid = true;
            }
            else {
                let error = {message: "Passwords don't match"}
                setErrors(error);
            }
           
        }
        else {
            // Display errors to user
            setErrors(validationResult);
        }

        return isValid;

    }

    const DisplayErrors = () => {
    
        if(errors.length == 0) {
            return;
        }
        
        return (
            Object.keys(errors).map((key, index) => {
                return(
                    <Text style={styles.errorLog}>{'\u2B24'} {errors[key]}</Text>
                )
            })
        )
    }

  return(
      <View>

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
            <TextInput secureTextEntry={true} style={styles.input} onChangeText={(val) => setPassword(val)}/>
        </View>
        
        <View style={[styles.row, styles.inputContainer]}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput secureTextEntry={true} style={styles.input} onChangeText={(val) => setConfirmPassword(val)}/>
        </View>

        <View  style={styles.row}>
            <Pressable style={styles.submitButton} onPress={async () => {await signUpStudent()}}>
                <Text style={styles.submitText}>Sign Up</Text>
            </Pressable>
        </View>
        
  
            <View style={styles.row}>
                <Pressable onPress={() => {props.navigation.navigate('Home')}} style={styles.cancelButton}>
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
    },
    errorLog: {
        width: 160,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
})


module.exports={StudentSignUp}