import React from 'react';
import {useAccountContext} from '../context/AccountContext';
import {EditStudentProfile} from '../components/EditStudentProfile'
import {EditTutorProfile} from '../components/EditTutorProfile';

function EditProfile() {
    const [account, setAccount] = useAccountContext();
    
    const TUTOR = "Tutor";
    const STUDENT = "Student";

    if(account.onModel == TUTOR) {
        return <EditTutorProfile />
    }

    if(account.onModel == STUDENT) {
        return <EditStudentProfile />
    }

}

module.exports = {EditProfile}