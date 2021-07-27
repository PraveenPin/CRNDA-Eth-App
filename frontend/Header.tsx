import React from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity, Appearance,Animated } from 'react-native';

import logo from '../assets/image/back.png';
import ProfileIcon from '../assets/image/profile.png';

export default function Header({ headerDisplay, navigation }): JSX.Element {

    const isLoginScreen = headerDisplay === 'Ethereum-Dapp-SocialNetwork';
    const isProfileScreen = headerDisplay === 'Profile';
    const isColorThemeLight = Appearance.getColorScheme() === 'light';
    
    return(
        <Animated.View>
            <View style={{...styles.headerContainer, backgroundColor: isColorThemeLight ? 'white' : 'black'}}>
                <View style={styles.header}>            
                    { !isLoginScreen && (<TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.5}
                        onPress={ () => navigation.goBack()}
                    >
                        <Image source={logo} style={styles.headerLogo}/>
                    </TouchableOpacity>)}
                    <View style={styles.textView}>
                        <Text style={isLoginScreen ? styles.textLoginScreen : styles.textScreen}>{headerDisplay}</Text>                        
                    </View>
                    <View style={{ width: '10%'}}>
                        {(!isLoginScreen && !isProfileScreen) && (<TouchableOpacity
                                                onPress={() => navigation.navigate('Profile')}
                                                activeOpacity={0.9}
                                            >
                                                <Image style={styles.profileIcon} source={ProfileIcon}/>
                                            </TouchableOpacity>)}
                    </View>
                </View> 
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 24,
        display: 'flex',
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    header:{
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 1,
        shadowOffset: {
          height: 0.5,
          width: 0
        }
    },
    button: {
        paddingLeft: 4,
        paddingRight: 4,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '10%'
    },
    textView: {
        width: '80%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 50,
        paddingTop: 12,
        paddingBottom: 8
    },
    textLoginScreen:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 18,
        justifyContent: 'center',
        paddingLeft: 30
    },
    textScreen:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 22,
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