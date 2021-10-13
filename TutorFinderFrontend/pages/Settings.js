import React, {useState} from 'react';
import {Text, ScrollView, Pressable, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Settings ({navigation}) {
    return(
        <ScrollView>
            <Pressable style={[styles.row, styles.pageLink]} onPress={() => {navigation.navigate('EditProfile')}}>
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