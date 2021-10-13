import React from 'react';
import {useAccountContext} from '../context/AccountContext';
import {EditStudentProfile} from '../components/EditStudentProfile'
import {EditTutorProfile} from '../components/EditTutorProfile';

function EditProfile({navigation}) {
    const [account, setAccount] = useAccountContext();
    
    const TUTOR = "Tutor";
    const STUDENT = "Student";

    if(account.onModel == TUTOR) {
        return <EditTutorProfile navigation={navigation}/>
    }

    if(account.onModel == STUDENT) {
        return <EditStudentProfile navigation={navigation} />
    }

}

module.exports = {EditProfile}