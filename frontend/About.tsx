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
                <View>
                    <View style={styles.textContainer}>
                        <Text style={styles.sideHeading2}>Tech Stack Involved </Text>
                        <View style={styles.subContainer}>                        
                            <Text style={styles.mainText2}>Expo with TypeScript</Text>
                            <Text style={styles.mainText2}>create-react-native-dapp npm package</Text>
                            <Text style={styles.mainText2}>Ganache for Block Chain</Text>       
                            <Text style={styles.mainText2}>Solidity for Smart Contracts</Text>   
                            <Text style={styles.mainText2}>Truffle framework to deploy Smart Contract</Text>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.sideHeading2}>Application tested on</Text>
                        <View style={styles.subContainer}>                        
                            <Text style={styles.mainText2}>#1 iOS/ iPhone 8</Text>
                            <Text style={styles.mainText2}>#2 Web/ Google Chrome</Text>
                        </View>
                    </View>
                </View>
               <View>
                    <View style={styles.textContainer}>
                        <Text style={styles.sideHeading}>Developed By </Text>
                        <Text style={styles.mainText}>Praveen Pinjala</Text>
                    </View>
                    <Text style={styles.footerNote}>*** Developed for dev/practice purposes only, not intended for production, and monetary purposes. ***</Text>
               </View>
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
    center: { justifyContent: 'space-between', display: 'flex', flexDirection: 'column' },
    // eslint-disable-next-line react-native/no-color-literals
    white: { backgroundColor: 'white' },
    textContainer: {
        padding: 8,
        marginTop: 8
    },
    sideHeading2: {
        fontSize: 14,
        color: '#999999', 
    },
    mainText2: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121' 
    },
    mainText:{
        marginTop: 8,
        paddingLeft: 4,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#212121' 
    },
    sideHeading: {
        fontSize: 18,
        paddingLeft: 4,
        color: '#212121'        
    },
    footerNote: {
        color: 'red',
        fontStyle: 'italic',
        marginBottom: 0,
        paddingLeft: 8,
        paddingRight: 8
    },
    subContainer: {     
        marginTop: 4,   
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#999999',
        paddingRight: 8,
        paddingLeft: 8,
        paddingBottom: 8
    }


});