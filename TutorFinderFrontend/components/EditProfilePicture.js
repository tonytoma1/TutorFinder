import React, {useEffect, useState} from 'react'
import {Image, Pressable, View, StyleSheet} from 'react-native'
import {useAccountContext} from '../context/AccountContext';

function EditProfilePicture() {
    const [account, setAccount] = useAccountContext();
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        setProfilePicture(account.profilePicture);
    },[])

    return (
        <View style={[styles.row]}>
            <Image style={[styles.profilePicture]} source={{uri: profilePicture}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    }, 
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
})

module.exports = {EditProfilePicture};