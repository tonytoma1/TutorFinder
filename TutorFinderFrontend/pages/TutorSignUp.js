import React, {useState, useRef, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAvoidingView, View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigation } from '@react-navigation/native'
import { validate } from 'validate.js';
import { API_URL } from  "@env";
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

function TutorForm(props) {
    const [subjectTyped, setSubjectTyped] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [price, setPrice] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [taughtSubjects, setTaughtSubjects] = useState([]);
    const [errors, setErrors] = useState({});
    const scrollViewRef = useRef();
    const subjectInputRef = useRef();

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
        },
        price: {
            presence: true,
            format: {
                pattern: "^[0-9]+$"
            }
        },
        jobTitle:{
            presence: true
        },
        subjects: {
            presence: true
        }
    } 

    async function signUpTutor() {
        props.setLoading(true);
        let userData = {
            firstName: firstName,
            lastName: lastName,
            email: email.toLowerCase(),
            password: password,
            confirmPassword: confirmPassword,
            subjects: taughtSubjects,
            price: price,
            jobTitle: jobTitle
        }
        let isValid = checkValidation(userData);

        if (isValid) {
            let url = API_URL + 'api/account/register-tutor';
            let errorFound;
            try {
                let result = await axios.post(url, userData);
                let message = "Account Was Successfully Created"
                props.setLoading(false);
                props.navigation.navigate('Home', { message: message });
            }
            catch (error) {
                errorFound = error;
                setErrors(error.response.data);
            }
                   
        }
        else {
            DisplayErrors();
        }

        props.setLoading(false);
    }

    function checkValidation(userData) {
        let isValid = false;
        let validationResult = validate(userData, constraints);
        let errorLog = {}

        if (validationResult != undefined) {
            errorLog = Object.assign(errorLog, validationResult);
        }
        if (password != confirmPassword) {
            let passwordError = { passwordMatchMessage: 'passwords don\'t match' }
            errorLog = Object.assign(errorLog, passwordError);
        }
        if (taughtSubjects <= 0) {
            let subjectsError = { subjectsSizeMessage: 'You must add at least 1 subject' }
            errorLog = Object.assign(errorLog, subjectsError);
        }
        // If no errors were found, then the form is valid.  
        if (Object.keys(errorLog).length == 0) {
            isValid = true;
        }
        if (Object.keys(errorLog).length != 0) {
            setErrors(errorLog);
        }


        return isValid;

    }



    const removeSubjects = (index) => {
        let subjects = [...taughtSubjects]
        subjects.splice(index, 1);
        setTaughtSubjects(subjects);
    }

    const goToHome = () => {
        props.navigation.navigate('Home');
    }

    const addSubject = (value) => {
    if(subjectTyped) {
        let subjects = taughtSubjects;
        subjects.push(subjectTyped);
        setSubjectTyped('');
        setTaughtSubjects(subjects);
        subjectInputRef.current.clear();    
        }

    }

    const DisplayErrors = () => {

        if (errors.length == 0) {
            return;
        }

        return (
            Object.keys(errors).map((key, index) => {
                return (
                    <Text style={styles.errorLog}>{'\u2B24'} {errors[key]}</Text>
                )
            })
        )
    }
    

    return (
        <KeyboardAvoidingView style={styles.tutorRegisterContainer} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
         
            <View>
            {errors.length != 0 ?  <DisplayErrors/>: null}
            </View>
            <View behavior="height" >
                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput style={styles.tutorInput} placeholder="John" onChangeText={(text) => { setFirstName(text) }} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput style={styles.tutorInput} placeholder="Doe" onChangeText={text => setLastName(text)} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.tutorInput} placeholder="john.doe@example.com" onChangeText={val => setEmail(val)} />
                </View>
                
                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.tutorInput} placeholder="Accountant, Engineering Student, Nurse, etc" onChangeText={val => setJobTitle(val)} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Price per hour</Text>
                    <TextInput style={styles.tutorInput} placeholder="20" keyboardType="numeric" onChangeText={val => setPrice(val)} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.tutorInput} secureTextEntry={true} onChangeText={val => setPassword(val)} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput style={styles.tutorInput} secureTextEntry={true} onChangeText={val => setConfirmPassword(val)} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Subjects</Text>
                    <TextInput style={styles.tutorInput} placeholder="Linear Algebra" ref={subjectInputRef}
                        onChangeText={(val) => setSubjectTyped(val)}
                        onBlur={() => addSubject()} />
                </View>
                <View style={[styles.row]}>
                    <Text style={styles.label}></Text>
                    <View style={styles.subjectTaughtContainer}>
                        {taughtSubjects.map((element, index) => {
                            return (
                                <View key={index} style={[styles.row, styles.subjectSelected]}>
                                    <Text style={styles.subjectText}>{element}</Text>
                                    <Pressable key={index} onPress={() => { removeSubjects(index) }} >
                                        <Icon name="times-circle" size={20} color="grey" />
                                    </Pressable>
                                </View>
                            )
                        })}
                    </View>
                </View>

                <View>
                    <Pressable onPress={async () => await signUpTutor()} style={[styles.signUpButton, styles.buttonMain]}>
                        <Text style={styles.centerText}>Sign up as a tutor</Text>
                    </Pressable>
                </View>

                <Pressable title="Cancel" onPress={() => goToHome()} style={[styles.signUpButton, styles.secondaryButton]}>
                    <Text style={styles.centerText}>Cancel</Text>
                </Pressable>

            </View>
        </KeyboardAvoidingView>
  )
}



const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    tutorInput: {
        width: '70%',
        height: 50,
        borderWidth: 1,

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
        textAlign: 'center'
    }
})

module.exports={TutorForm}