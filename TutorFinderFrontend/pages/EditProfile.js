import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native'
import {useAccountContext} from '../context/AccountContext';
import {EditStudentProfile} from '../components/EditStudentProfile'
import {EditTutorProfile} from '../components/EditTutorProfile';
import Spinner from 'react-native-loading-spinner-overlay';

function EditProfile({navigation}) {
    const [account, setAccount] = useAccountContext();
    const [loading, setLoading] = useState(false);

    const TUTOR = "Tutor";
    const STUDENT = "Student";


    return (
        <View style={styles.container}>
            <Spinner visible={loading} />
            {account.onModel == TUTOR ? <EditTutorProfile navigation={navigation} loading={loading} setLoading={setLoading}/>
            : <EditStudentProfile navigation={navigation} />}
        </View>
    )
 
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

module.exports = {EditProfile}