import React from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import logo from '../assets/image/app-icon.png';

export default function Header(props): JSX.Element {
    return(
        <View style={styles.header}>
            <Image source={logo} style={{ width: 35, height: 35, margin: 4 }}/>
            <View>
                <Text style={styles.text}>{props.headerDisplay}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        display: 'flex',
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    text:{
        fontFamily: 'OpenSans'
    }
});