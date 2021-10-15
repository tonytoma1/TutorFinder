import React, {useEffect, useState, useRef} from 'react';
import {Text, ScrollView, TextInput, View, StyleSheet, Image, Pressable, Modal,
Alert} from 'react-native';
import {useAccountContext} from '../context/AccountContext';
import Icon from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';
import { API_URL } from  "@env";

function EditTutorProfile({navigation, loading, setLoading}) {
    const [account, setAccount] = useAccountContext();
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [price, setPrice] = useState('')
    const [jobTitle, setJobTitle] = useState('') 
    const [description, setDescription] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [typedSubject, setTypedSubject] = useState('')
    const subjectInputRef = useRef();


    useEffect(() => {
        setProfilePicture(account.profilePicture);
        setEmail(account.email);
        setFirstName(account.firstName);
        setLastName(account.lastName);
        setPrice(account.accountType.price);
        setJobTitle(account.accountType.jobTitle);
        setDescription(account.accountType.description);
        setSubjects(account.accountType.subjects);
    }, [])

    const displayAlert = (message, errorMessage) => {
        Alert.alert(message, errorMessage,
        [{text: 'Ok'}])
    }


    const updateAccount = async () => {
        setShowModal(false);
        setLoading(true)
        let response
        let message = "";
        let errorMessage = ""
        try {
            let updatedInformation = {
                accountId: account._id,
                email: email,
                firstName: firstName,
                lastName: lastName,
                price: price,
                description: description,
                jobTitle: jobTitle,
                subjects: subjects
            }
            let updateUrl = API_URL + 'api/account/update-tutor-account'
            let result = await axios.post(updateUrl, updatedInformation)
            response = result;
        }
        catch(error) {
            response = error
        }
        finally {
            setLoading(false)
            if(response.status == 200) {
                message = "Update Successful"
            }
            else {
                message = "Update Failed. Please Try Again"
                errorMessage = response.data.error;
            }
            displayAlert(message, errorMessage)
        }
    }

    const addSubject = (value) => {
        if(typedSubject) {
            let taughtSubjects = subjects;
            taughtSubjects.push(typedSubject);
            setTypedSubject('');
            setSubjects(subjects);
            subjectInputRef.current.clear();    
            }
    
        }

    const removeSubjects = (index) => {
        let taughtSubjects = [...subjects]
        taughtSubjects.splice(index, 1);
        setSubjects(taughtSubjects);
    }

    const DisplayModal = ({showModal, setShowModal}) => {
        return (
            <Modal visible={showModal} animationType='slide'>
                <View style={styles.modalContainer}>
                    <Text>Are you sure you want to Update your profile?</Text>
                    <Pressable style={[styles.updateButton, styles.modalButton]} onPress={async () => { await updateAccount()}}>
                        <Text style={[styles.modalText]}>Update</Text>
                    </Pressable>
                    <Pressable style={[styles.cancelButton, styles.modalButton]} onPress={() => {setShowModal(false)}}>
                        <Text style={[styles.modalText]}>Cancel</Text>
                    </Pressable>
                </View>
            </Modal>
        )
    }

    return (
        <ScrollView style={styles.container}>

            <DisplayModal showModal={showModal} setShowModal={setShowModal}/>

            <View style={[styles.row]}>
                <Image style={[styles.profilePicture]} source={{uri: profilePicture}}/>
                
            </View>
            <View style={[styles.row,styles.inputContainer]}>
                <Text style={[styles.label]}>Email</Text>
                <TextInput style={[styles.input]} defaultValue={email} onChangeText={val => setEmail(val)}/>
            </View>
            <View style={[styles.row,styles.inputContainer]}>
                <Text style={[styles.label]}>First Name</Text>
                <TextInput style={[styles.input]} defaultValue={firstName} onChangeText={val => setFirstName(val)}/>
            </View>
            <View style={[styles.row,styles.inputContainer]}>
                <Text style={[styles.label]}>Last Name</Text>
                <TextInput style={[styles.input]} defaultValue={lastName} onChangeText={val => setLastName(val)}/>
            </View>
            <View style={[styles.row,styles.inputContainer]}>
                <Text style={[styles.label]}>Price / hr</Text>
                <TextInput style={[styles.input]} defaultValue={price.toString()} onChangeText={val => setPrice(val)}
                 keyboardType="numeric"/>
            </View>
            <View style={[styles.row,styles.inputContainer]}>
                <Text style={[styles.label]}>Title</Text>
                <TextInput style={[styles.input]} defaultValue={jobTitle} onChangeText={val => setJobTitle(val)}/>
            </View>
            <View style={[styles.row,styles.inputContainer]}>
                <Text style={[styles.label]}>Description</Text>
                <TextInput style={[styles.input]} multiline={true} onChangeText={val => setDescription(val)}
                defaultValue={description}/>
            </View>
            <View style={[styles.row, styles.inputContainer, styles.subjectInputContainer]}>
                <Text style={[styles.label]}>Subjects</Text>
                <TextInput style={[styles.input]} onChangeText={val => {setTypedSubject(val)}}
                onBlur={() => {addSubject()}} ref={subjectInputRef}/>
            </View>
            <View style={[styles.row, styles.subjectContainer]}>
                <Text style={styles.label}></Text>
                    <View style={styles.subjectTaughtContainer}> 
                    {subjects.map((element, index) => {
                        return (
                            <View style={[styles.subjectSelected, styles.row]}>
                                <Text style={styles.subjectText}>{element}</Text>
                                <Pressable key={index} onPress={() => { removeSubjects(index) }} >
                                        <Icon name="times-circle" size={20} color="grey" />
                                </Pressable>
                            </View>

                        )
                    })}
                    </View>
             
            </View>
            <View style={styles.row}>
                <Pressable style={styles.updateButton} onPress={() => {setShowModal(true)}}>
                    <Text style={styles.updateButtonText}>Update Profile</Text>
                </Pressable>
            </View>
            <View style={styles.row}>
                <Pressable style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText} onPress={() => {navigation.navigate('Settings')}}>Cancel</Text>
                </Pressable>
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      
    },
    row: {
        flexDirection: 'row'
    },
    col: {
        flexDirection: 'column'
    },
    label: {
      fontSize: 15,
      width: 100  
      
    },
    inputContainer: {
        paddingLeft: 10,
        paddingTop: 10,
        paddingRight: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#11C281',
        width: '80%',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 20
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    updateButton: {
        width: '80%',
        height: 30,
        backgroundColor: '#11C281',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10
    },
    cancelButton: {
        width: '80%',
        height: 30,
        borderColor: '#11C281',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        borderWidth: 1
    },
    updateButtonText: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        color: 'white'
    },
    cancelButtonText: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
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
        borderColor: '#11C281',
    },
    subjectTaughtContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    subjectText: {
        marginRight: 5
    },
    subjectContainer: {
        marginBottom: 10,
    },
    modalContainer: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    modalButton: {
        width: 200,
        marginTop: 10
    },
    modalText: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto'
    }
 
})


module.exports = {EditTutorProfile}