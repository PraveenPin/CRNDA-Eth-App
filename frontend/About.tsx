import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

export default class About extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return (
            <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
                <Text> ........... Under Construction ........... </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f4f4f4',
        alignItems:'center'
    },
    center: { alignItems: 'center', justifyContent: 'center' },
    // eslint-disable-next-line react-native/no-color-literals
    white: { backgroundColor: 'white' }
});