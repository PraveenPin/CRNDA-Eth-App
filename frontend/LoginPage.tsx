import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Button, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Web3 from 'web3';
import SocialNetwork from '../abis/SocialNetwork.json';
import globalCatalog from './CatalogDB';
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
            userAddress: null,
            user: {},
            userDetails: {},
            contract: null,
            web3: null,
            userName: '',
            creatingUser: false

        }
    }

    async componentDidMount(){
        //initial setup for smart contract     
        const web3 = new Web3(new Web3.providers.HttpProvider(`http://${GANACHE_IP_ADDRESS}:${GANACHE_PORT}`));        
        const accounts = await web3.eth.getAccounts();
        this.setState({ web3: web3, userAddress: accounts[1] });
        console.log("addres",accounts);
        await this.shouldDeployContract(this.state.web3);
    }

    shouldDeployContract = async (web3 : Web3) => {
      
        const networkId = await web3.eth.net.getId();
        const networkData = SocialNetwork.networks[networkId];  
        let socialNetwork = null;
        if(networkData){
          //bad to override transactionConfirmationBlocks' value, overridden here for test environment
          socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address, {transactionConfirmationBlocks: 1});
          this.setState({ contract: socialNetwork });
          const user = await socialNetwork.methods.getUserIdFromAddress(this.state.userAddress).call();
          console.log("Usrt",user);
            if(!(user > 0)){
                this.setState({ userExists: false, firstTimeLogin: -1 });
            }
            else{        
                const userInfo = await socialNetwork.methods.getUserInfo().call({from: this.state.userAddress});
                const userDetails: UserDetails = {
                    id: userInfo[0],
                    name: userInfo[1],
                    followersCount: userInfo[2],
                    followingCount: userInfo[3],
                    tipObtained: userInfo[4],
                    tipDonated: userInfo[5]
                };
                this.setState({ userExists: true, userDetails });
            }
        }
        else{
          window.alert("Social Network contract not deployed to detected network");
        }
      };

    connectWallet = () => {
        this.props.connector.connect();
    }

    disconnectWallet = () => {
        this.props.connector.killSession();
    }

    createUser = async (userName) => {
        this.setState({ creatingUser: true });
        const gasEstimate = await this.state.contract.methods.autoCreateUser(userName).estimateGas({ from: this.state.userAddress });
        this.state.contract.methods.autoCreateUser(userName).send({from: this.state.userAddress, gas: gasEstimate})
        .once('receipt', (receipt) => {
          this.setState({ creatingUser: false }, () => this.shouldDeployContract(this.state.web3));
        });
    }

    render(){

        return(
            <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
            {!!this.props.connector && !!this.props.connector.connected ? (
              <>
                {/* <TouchableOpacity onPress={signTransaction}>
                  <Text>Sign a Transaction</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={this.disconnectWallet}>
                  <Text>Kill Session</Text>
                </TouchableOpacity>
              </>
            ): (
                <TouchableOpacity onPress={this.connectWallet}>
                  <Text>Connect a Wallet</Text>
                </TouchableOpacity>
            )}
      
            {!this.state.userExists ? (!this.state.creatingUser ? (
                    <SignUpForm
                    web3={this.state.web3}
                    contract={this.state.contract}
                    createUser={this.createUser}
                    />) : (<ActivityIndicator/>)) : (                  
                <TouchableWithoutFeedback
                        onPress={ () => { this.props.navigation.navigate('HomePage', {
                            // userDetails: this.state.userDetails,
                            userAddress: this.state.userAddress,
                            contract: this.state.contract,
                            // connector: this.props.connector
                        })}}
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
        backgroundColor: '#f4f4f4',
        alignItems:'center'
    },
    title: {
        paddingBottom: 10,
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
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
    center: { alignItems: 'center', justifyContent: 'center' },
    // eslint-disable-next-line react-native/no-color-literals
    white: { backgroundColor: 'white' }
});