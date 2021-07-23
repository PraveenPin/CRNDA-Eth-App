import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp';
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Web3 from 'web3';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { expo } from '../app.json';
import HomePage from './HomePage';
import Header from './Header';
import Footer from './Footer';
import { navigationRef } from './RootNavigation';
import NewsDetail from './NewsDetail';
import About from './About';
import ProfilePage from './Profile';
import PostDetail from './PostDetail';
import ExplorePage from './ExplorePage';
import LoginPage from './LoginPage';
import MyNetworkPage from './MyNetworkPage';
import UserPosts from './UserPosts';
import SocialNetwork from '../abis/SocialNetwork.json';


const GANACHE_PORT:string = "7545";
const GANACHE_IP_ADDRESS:string = "192.168.0.7";

const Stack: any = createStackNavigator();

function App(): JSX.Element {
  const connector = useWalletConnect();

  const [userAddress, setUserAddress] = useState(null);
  const [contract, setContract] = useState(undefined);
  const [web3, setWeb3] = useState(null);
  const [initialSetup, setInitialSetup] = useState(true);
  const [userDetails, setUserDetails] = useState([]);

  const setUserDetailsFromLoginPage = (userDetails) => {
    setUserDetails(userDetails);
  }

  useEffect(() => {
    (async () => {
      const web3 = new Web3(new Web3.providers.HttpProvider(`http://${GANACHE_IP_ADDRESS}:${GANACHE_PORT}`));        
      setWeb3(web3);
      
      const accounts = await web3.eth.getAccounts();
      Platform.OS === 'web' ? setUserAddress(accounts[1]) : setUserAddress(accounts[2]);
      console.log("addres",accounts);
      
      const networkId = await web3.eth.net.getId();
      const networkData = SocialNetwork.networks[networkId];  
      if(networkData){
        //bad to override transactionConfirmationBlocks' value, overridden here for test environment
        const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address, {transactionConfirmationBlocks: 1});
        setContract(socialNetwork);
        setInitialSetup(false);
      }
      else{
        window.alert("Social Network contract not deployed to detected network");
      }
      
    })();
  },[]);

  if(initialSetup){
    return (
      <AppLoading/>
    ); 
  }

  return (      
    <NavigationContainer
      // style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
      ref={navigationRef}
    >
      <Stack.Navigator initialRouteName="LoginPage" headerMode="screen">
        <Stack.Screen 
          name="LoginPage" 
          options={{
            header: (props) => <Header {...props} headerDisplay="Ethereum-Dapp-SocialNetwork"/>
          }}>
            {props => !!contract && (<LoginPage 
                        {...props}
                        connector={connector}
                        userAddress={userAddress}
                        contract={contract}
                        web3={web3}
                        setUserDetailsFromLoginPage={setUserDetailsFromLoginPage}
                      />)}
        </Stack.Screen>
        <Stack.Screen 
          name="HomePage"
          options={{
            header: (props) => <Header {...props} headerDisplay="Home"/>
          }}
        >
          {props => <HomePage 
                    {...props}
                    userAddress={userAddress}
                    contract={contract}
                  />}

        </Stack.Screen>
        <Stack.Screen 
          name="NewsDetail" 
          component={NewsDetail} 
          options={{
            header: (props) => <Header {...props} headerDisplay="News"/>
          }}
        />
        <Stack.Screen 
          name="About" 
          component={About} 
          options={{
            header: (props) => <Header {...props} headerDisplay="About"/>
          }}
        />
        <Stack.Screen 
          name="Profile"
          options={{
            header: (props) => <Header {...props} headerDisplay="Profile"/>
          }}
        >
            {props => <ProfilePage 
                  {...props}
                  userAddress={userAddress}
                  contract={contract}
                  userDetails={userDetails}
                  web3={web3}
                />}

        </Stack.Screen>
        <Stack.Screen 
          name="PostDetail" 
          options={{
            header: (props) => <Header {...props} headerDisplay="PostDetail"/>
          }}
        >
        {props => <PostDetail 
                  {...props}
                  userAddress={userAddress}
                  contract={contract}
                  web3={web3}
                />}
        </Stack.Screen>
        <Stack.Screen 
          name="Explore"
          options={{
            header: (props) => <Header {...props} headerDisplay="Explore"/>
          }}
        >
          {props => <ExplorePage 
                    {...props}
                    userAddress={userAddress}
                    contract={contract}
                    web3={web3}
                  />}
        </Stack.Screen>
        <Stack.Screen 
          name="MyNetwork"
          options={{
            header: (props) => <Header {...props} headerDisplay="Your Network"/>
          }}
        >
          {props => <MyNetworkPage 
                    {...props}
                    userAddress={userAddress}
                    contract={contract}
                    web3={web3}
                  />}
        </Stack.Screen>
        <Stack.Screen 
          name="UserPosts"
          options={{
            header: (props) => <Header {...props} headerDisplay="Posts"/>
          }}
        >
          {props => <UserPosts 
                    {...props}
                    userAddress={userAddress}
                    contract={contract}
                    web3={web3}
                  />}
        </Stack.Screen>
      </Stack.Navigator>
      <Footer/>
    </NavigationContainer>
  );
  
  
}

const { scheme } = expo;

export default withWalletConnect(App, {
  redirectUrl: Platform.OS === 'web' ? window.location.origin : `${scheme}://`,
  storageOptions: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    asyncStorage: AsyncStorage,
  },
});