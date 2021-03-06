import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Button, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Web3 from 'web3';
import SocialNetwork from '../abis/SocialNetwork.json';
import { navigationRef } from './RootNavigation';
import UserDetails from './DataTypes';
import HomePage from './HomePage';
import SignUpForm from './SignUpForm';

const GANACHE_PORT:string = "7545";
const GANACHE_IP_ADDRESS:string = "192.168.0.8";

export default class LoginPage extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state={
            userExists: false,
            user: {},
            userDetails: {},
            userName: '',
            creatingUser: false

        }
    }

    componentDidMount(){
        console.log("THis.props.",this.props);
        this.getUserDetails();
    }

    getUserDetails = async () => {
        const user = await this.props.contract.methods.getUserIdFromAddress(this.props.userAddress).call();
        console.log("Usrt",user);
        if(!(user > 0)){
            this.setState({ userExists: false, firstTimeLogin: -1 });
        }
        else{        
            const userInfo = await this.props.contract.methods.getUserInfo().call({from: this.props.userAddress});
            const userDetails: UserDetails = {
                id: userInfo[0],
                name: userInfo[1],
                followersCount: userInfo[2],
                followingCount: userInfo[3],
                tipObtained: userInfo[4],
                tipDonated: userInfo[5]
            };
            this.setState({ userExists: true, userDetails }, () => this.props.setUserDetailsFromLoginPage(userDetails));
        }
    }

    connectWallet = () => {
        this.props.connector.connect();
    }

    disconnectWallet = () => {
        this.props.connector.killSession();
    }

    createUser = async (userName: string) => {
        this.setState({ creatingUser: true });
        const gasEstimate = await this.props.contract.methods.autoCreateUser(userName).estimateGas({ from: this.props.userAddress });
        this.props.contract.methods.autoCreateUser(userName).send({from: this.props.userAddress, gas: gasEstimate})
        .once('receipt', (receipt) => {
          this.setState({ creatingUser: false }, () => this.getUserDetails());
        });
    }

    render(){

        return(
            <View style={[StyleSheet.absoluteFill, styles.center]}>                    
                {!!this.props.connector && !!this.props.connector.connected ? (
                <>
                    <TouchableOpacity style={styles.touchText} onPress={this.disconnectWallet}>
                        <Text style={styles.textView}>Kill Session</Text>
                    </TouchableOpacity>
                </>
                ): (                  
                    <TouchableOpacity style={styles.touchText} onPress={this.connectWallet}>
                        <Text style={styles.textView}>Connect a Wallet</Text>
                    </TouchableOpacity>
                )}
      
                {!this.state.userExists ? (!this.state.creatingUser ? (
                    <SignUpForm
                    web3={this.props.web3}
                    contract={this.props.contract}
                    createUser={this.createUser}
                    />) : (<ActivityIndicator/>)) : (                  
                <TouchableWithoutFeedback
                    style={styles.loginMessage}
                        onPress={ () => { this.props.navigation.navigate('Explore')}}
                >
                    <Text style={styles.title}>INSTANT LOGIN as {this.state.userDetails.name}</Text>
                </TouchableWithoutFeedback>
            )}
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:'center',
        backgroundColor: 'red'
    },
    title: {
        paddingBottom: 10,
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 18
    },
    textView: {
        fontSize: 18
    },
    touchText: {
        // marginTop: Dimensions.get('window').height /8,
        alignItems: 'center',
    },
    loginMessage:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        height: 40,
        width: 250,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 26,
        fontFamily: 'OpenSans',
    },
    label: {
        fontFamily: 'OpenSans',
        fontSize: 18,
        paddingTop: 20
    },
    center: { justifyContent: 'center' },
    // eslint-disable-next-line react-native/no-color-literals
    white: { backgroundColor: 'white' }
});