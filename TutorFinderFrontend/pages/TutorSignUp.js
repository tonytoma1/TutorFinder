import React, {useState, useRef, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView, View, Text, TextInput, StyleSheet, ScrollView, Button, Pressable} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {navigation} from '@react-navigation/native'

function TutorForm(props) {
    const [subjectTyped, setSubjectTyped] = useState('');
    const [taughtSubjects, setTaughtSubjects] = useState([]);
    const scrollViewRef = useRef();
    const subjectInputRef = useRef();

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
    

    return(
        <ScrollView style={styles.tutorRegisterContainer} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
            <KeyboardAvoidingView behavior="height" >
                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput style={styles.tutorInput} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput style={styles.tutorInput} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.tutorInput} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput style={styles.tutorInput} />
                </View>

                <View style={[styles.row, styles.inputContainer]}>
                    <Text style={styles.label}>Subjects</Text>
                    <TextInput style={styles.tutorInput} ref={subjectInputRef}
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
                <View style={[styles.row]}>
                    <Text style={styles.label}></Text>
                </View>

                <View>
                    <TouchableOpacity style={[styles.signUpButton, styles.buttonMain]}>
                        <Text style={styles.centerText}>Sign up as a tutor</Text>
                    </TouchableOpacity>
                </View>

                <Pressable title="Cancel" onPress={() => goToHome()} style={[styles.signUpButton, styles.secondaryButton]}>
                    <Text style={styles.centerText}>Cancel</Text>
                </Pressable>

            </KeyboardAvoidingView>
        </ScrollView>
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

module.exports={TutorForm}