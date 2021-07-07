import React from 'react';
import { Platform, StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import logo from '../assets/image/app-icon.png';

export default function Header({ headerDisplay, navigation}): JSX.Element {
    return(
        <View style={styles.header}>            
            <TouchableOpacity
                style={styles.button}
                onPress={ () => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            <Image source={logo} style={{ width: 35, height: 35, margin: 4 }}/>
            <View>
                <Text style={styles.text}>{headerDisplay}</Text>
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
    button: {
        padding: 20,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    text:{
        fontFamily: 'OpenSans'
    },
    buttonText:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
    }
});