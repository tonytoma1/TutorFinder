import React, {useEffect, useState, useRef} from 'react';
import {Text, ScrollView, TextInput, View, StyleSheet, Image, Pressable, Modal,
Alert} from 'react-native';
import {useAccountContext} from '../context/AccountContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { API_URL } from  "@env";
import axios from 'axios';
import {EditProfilePicture} from '../components/EditProfilePicture';

function EditStudentProfile({navigation}) {
    const [account, setAccount] = useAccountContext();
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [profilePicture, setProfilePicture] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [typedSubject, setTypedSubject] = useState('')
    const subjectInputRef = useRef();

    useEffect(() => {
        setProfilePicture(account.profilePicture);
        setEmail(account.email);
        setFirstName(account.firstName);
        setLastName(account.lastName);
    }, [])

    const displayAlert = (message, errorMessage) => {
        Alert.alert(message, errorMessage,
        [{text: 'Ok'}])
    }

    const updateAccount = async () => {
        setShowModal(false);
        setLoading(true);
        let message = ''
        let errorMessage = '';
        let updateUrl = API_URL + "api/account/update-student-account";

        let updatedInformation = {
            accountId: account._id,
            email: email,
            firstName: firstName,
            lastName: lastName
        }
            
        try {
            let response = await axios.post(updateUrl, updatedInformation);
            setAccount(response.data.account);
            message = "Account Updated Successfully"
        }
        catch(error) {
            message = "Update Failed"
            errorMessage = error.response.data.error;

        }
        finally {
            setLoading(false);
            displayAlert(message, errorMessage);
        }
        
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
            <Spinner visible={loading} />

            <DisplayModal showModal={showModal} setShowModal={setShowModal}/>

            <EditProfilePicture/>
            
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

module.exports = {EditStudentProfile}