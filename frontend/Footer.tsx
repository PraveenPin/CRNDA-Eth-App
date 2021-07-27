import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import * as RootNavigation from './RootNavigation';
import HomeIcon from '../assets/image/home.png';
import ExploreIcon from '../assets/image/explore.jpg';
import AboutIcon from '../assets/image/info.png';

export default function Footer({navRef}): JSX.Element {
    const currentPage = navRef.current?.getCurrentRoute();

    const [disabled, setDisabled] = useState(currentPage?.name === 'LoginPage');

    useEffect( () => {
        setDisabled(currentPage?.name === 'LoginPage');
    }, [navRef]);


        return(
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => RootNavigation.navigate('CreatePage')}
                    disabled={disabled}
                >
                    <Image source={HomeIcon} style={{ width: 28, height: 28 }}/>
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => RootNavigation.navigate('Explore')}
                    disabled={disabled}
                >
                    <Image source={ExploreIcon} style={{ width: 28, height: 28 }}/>
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => RootNavigation.navigate('About')}
                    disabled={disabled}
                >
                    <Image source={AboutIcon} style={{ width: 28, height: 28 }}/>
                    <Text>About</Text>
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer:{
        display: 'flex',
        width: '100%',
        height: 56,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        backgroundColor: 'white'
    },
    button:{
        padding: 4,
        alignItems: 'center'
    }
});