import React, {useState} from 'react';
import {Text, ScrollView, Pressable, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useAccountContext} from '../context/AccountContext';

function Settings ({navigation}) {
    const [account, setAccount] = useAccountContext();
    const TUTOR = 'Tutor';
    const STUDENT = 'Student';

    // navigates to the correct edit account screen depending if the user that is logged in is a 
    // tutor or a student
    function editAccount() {
        if(account.onModel == TUTOR) {
            navigation.navigate('EditTutor')
        }
        else {
            navigation.navigate('EditStudent')
        }
    }

    return(
        <ScrollView>
            <Pressable style={[styles.row, styles.pageLink]} onPress={() => {editAccount()}}>
                <Text style={styles.linkFont}>Edit Account</Text>
            </Pressable>
            <Pressable style={[styles.row, styles.pageLink]} >
                <Text style={styles.linkFont}>Logout</Text>
            </Pressable>
        </ScrollView>
      
    )
}


const styles = StyleSheet.create({
   row: {
        flexDirection: 'row'
   },
   pageLink: {
       borderBottomWidth: 1,
       padding: 10
   },
   linkFont: {
       fontFamily: 'Montserrat',
       fontSize: 25
   }
 })


module.exports = {Settings}