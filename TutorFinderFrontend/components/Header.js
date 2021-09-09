import {View, Text, StyleSheet, Image} from 'react-native';
import Logo from '../images/logo.png';
import React from 'react';

const Header = () => {
    return(
        <Image source={Logo} style={styles.logo}/>       
    )
}

const styles = StyleSheet.create({
  
})

export default Header;