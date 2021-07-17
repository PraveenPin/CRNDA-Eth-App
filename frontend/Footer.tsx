import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as RootNavigation from './RootNavigation';

export default function Footer(props): JSX.Element {
        return(
            <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                    onPress={() => RootNavigation.navigate('Ethereum-Dapp-SocialNetwork')}
                >
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => RootNavigation.navigate('Explore')}
                >
                    <Text>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => RootNavigation.navigate('Profile', {
                        model: 'Footer',
                        modelName: 'NoMessage'
                    })}
                >
                    <Text>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => RootNavigation.navigate('About')}
                >
                    <Text>About</Text>
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer:{
        display: 'flex',
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4'
    },
    button:{
        padding: 15
    }
});