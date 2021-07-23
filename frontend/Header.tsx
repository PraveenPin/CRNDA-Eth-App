import React from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import logo from '../assets/image/back.png';
import ProfileIcon from '../assets/image/profile.png';

export default function Header({ headerDisplay, navigation }): JSX.Element {

    const isLoginScreen = headerDisplay === 'Ethereum-Dapp-SocialNetwork';
    const isProfileScreen = headerDisplay === 'Profile';
    
    return(
        <View style={styles.headerContainer}>
            <View style={styles.header}>            
                { !isLoginScreen && (<TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.5}
                    onPress={ () => navigation.goBack()}
                >
                    <Image source={logo} style={styles.headerLogo}/>
                </TouchableOpacity>)}
                <View style={{...styles.textView, width: isLoginScreen ? '100%': '80%'}}>
                    <Text style={isLoginScreen ? styles.textLoginScreen : styles.textScreen}>{headerDisplay}</Text>
                    {(!isLoginScreen && !isProfileScreen) && (<TouchableOpacity
                                            onPress={() => navigation.navigate('Profile')}
                                            activeOpacity={0.9}
                                        >
                                            <Image style={styles.profileIcon} source={ProfileIcon}/>
                                        </TouchableOpacity>)}
                </View>
            </View> 
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 24,
        backgroundColor: 'black',
        display: 'flex',
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',

    },
    header:{
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fafafa',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 0
        }
    },
    button: {
        paddingLeft: 4,
        paddingRight: 4,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    textView: {
        width: '80%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 50,
        paddingTop: 8,
        paddingBottom: 8
    },
    textLoginScreen:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 18,
        justifyContent: 'center',
        paddingLeft: 12,    
    },
    textScreen:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 26,
        paddingLeft: 12,        
        justifyContent: 'center'
    },
    buttonText:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
    },
    headerLogo: { width: 24, height: 24 },
    profileIcon: { width: 28, height: 28, marginRight: -24, marginTop: 4 }
});