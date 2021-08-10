import {View, Text, StyleSheet, Image} from 'react-native';
import Logo from '../images/logo.png';
import React from 'react';

const NavigationBar = () => {
    return(
      
            <Image source={Logo} style={styles.logo}/>    
       
    )
}

const styles = StyleSheet.create({

    logo: {
       
       
      
        
        
    }
    
})

export default NavigationBar;