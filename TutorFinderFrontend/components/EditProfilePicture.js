import React, {useEffect, useState} from 'react'
import {Image, Pressable, View, StyleSheet, Text, Button, Modal, Platform, Alert} from 'react-native'
import {useAccountContext} from '../context/AccountContext';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { API_URL, REFRESH_TOKEN_STORAGE_KEY, ACCESS_TOKEN_STORAGE_KEY } from  "@env";
import axios from 'axios';

function EditProfilePicture() {
    const [account, setAccount] = useAccountContext();
    const [profilePicture, setProfilePicture] = useState('');
    const [modalImage, setModalImage] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProfilePicture(account.profilePicture);
    },[])

    const displayAlert = (message, errorMessage) => {
        Alert.alert(message, errorMessage,
        [{text: 'Ok'}])
    }


    function selectImage() {
      launchImageLibrary({}, (response) => {
            if(response.assets) {
                setModalImage(response.assets[0])
                setShowModal(true);
            }
        }) 
              
    }

    async function uploadProfilePicture()  {
        const uploadUrl = API_URL + "api/account/upload-profile-picture";
        setLoading(true);
        setShowModal(false);
        let message = "";
        let errorMessage = "";
        try {
            let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
            let data = new FormData();
            data.append('profile_picture', {
                name: modalImage.fileName,
                type: modalImage.type,
            uri: Platform.OS === "ios" ? modelImage.uri.replace('file://', '') : modalImage.uri})

            let headers = {headers: {'Authorization': 'Bearer ' + accessToken}};

            let result = await axios.post(uploadUrl, data, headers);  
            if(result.data.accountUpdated) {
                setAccount(result.data.savedAccount);
                setProfilePicture(result.data.savedAccount.profilePicture)
                message = "Picture updated successfully"
            }
            else {
                message = "Account update failed";
            }
        }
        catch(error) {
            if(error == 'INVALID_ACCESS_TOKEN') {
                // get a new access token through a refresh token
            }
            errorMessage = error;
        }
        setLoading(false)
        displayAlert(message, errorMessage);
    }

    const DisplayModal = ({showModal, setShowModal}) => {
        return (
            <Modal visible={showModal} animationType='slide'>
                <View style={[styles.col, styles.modalContainer]}>
                    <View style={styles.row}>
                        <Image style={[styles.modalPictureBox]} source={{uri: modalImage.uri}}/>
                    </View>
                    <View styles={styles.row}>
                        <Text style={styles.confirmText}>Are you sure you want to Update your Profile Picture?</Text>                    
                    </View>
                    <Pressable style={[styles.updateButton, styles.modalButton]} onPress={async () => { await uploadProfilePicture()}}>
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
        <View style={[styles.col]}>
            <Spinner visible={loading}/>
            <DisplayModal showModal={showModal} setShowModal={setShowModal}/>
            <View style={styles.row}>
                <Image style={[styles.profilePictureBox]} source={{uri: profilePicture}}/>
            </View>
          
            <View style={styles.row}>
            <Pressable style={styles.profileImageButton} onPress={selectImage}>
                <Text>Edit Profile Picture</Text>
            </Pressable>
            </View>
               
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    }, 
    col: {
      flexDirection: "column",
    
    },
    profilePictureBox: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    modalPictureBox: {
        width: 100,
        height: 100,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    profileImageButton: {
        backgroundColor: '#11C281',
        marginLeft: 'auto',
        marginRight: 'auto'
        
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
    modalButton: {
        width: 200,
        marginTop: 10
    },
    modalContainer: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    confirmText: {
        textAlign: 'center',
        marginTop: 20
    },
    modalText: {
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto'
    }
})

module.exports = {EditProfilePicture};