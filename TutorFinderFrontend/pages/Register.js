import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Pressable} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {RadioButton, TextInput} from 'react-native-paper';
import {TutorForm} from './TutorSignUp';
import {StudentSignUp} from '../components/StudentSignUp';

function Register({navigation}) {
    const [displayStudentForm, setDisplayStudentForm] = useState(true);
    const scrollRef = useRef();    

    return(
        <ScrollView ref={scrollRef} onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})} >
            <Text>I am a</Text>
            <RadioButton.Group onValueChange={value => setDisplayStudentForm(value)} value={displayStudentForm}>
                <View style={styles.row}>
                    <RadioButton value={true}/>
                    <Text>Student</Text>
                </View>
                
                <View style={styles.row}>
                    <RadioButton value={false}/>
                    <Text>Tutor</Text>
                </View>
            </RadioButton.Group>

            {displayStudentForm ? <StudentSignUp navigation={navigation} /> : <TutorForm navigation={navigation} />}
          
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    input: {
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
        
    }
    
})



module.exports = {Register}