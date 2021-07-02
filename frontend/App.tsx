import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import localhost from 'react-native-localhost';
import Web3 from 'web3';
import { useFonts } from 'expo-font';
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


const Stack: any = createStackNavigator();

function App(): JSX.Element {

  let [fontsLoaded] = useFonts({ 
    'OpenSans': require('../assets/fonts/OpenSans-Regular.ttf')
  });

  if(!fontsLoaded){
    return (
      <AppLoading/>
    ); 
  }
  else{
    return (      
      <NavigationContainer
        // style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
        ref={navigationRef}
      >
        <Stack.Navigator initialRouteName="Ethereum-Dapp-SocialNetwork" headerMode="screen">
          <Stack.Screen 
            name="Ethereum-Dapp-SocialNetwork" 
            component={HomePage} 
            options={{
              header: () => <Header headerDisplay="Ethereum-Dapp-SocialNetwork"/>
            }}
          />
          <Stack.Screen 
            name="NewsDetail" 
            component={NewsDetail} 
            options={{
              header: () => <Header headerDisplay="News"/>
            }}
          />
          <Stack.Screen 
            name="About" 
            component={About} 
            options={{
              header: () => <Header headerDisplay="About"/>
            }}
          />
        </Stack.Navigator>
        <Footer/>
      </NavigationContainer>
    );
  }
  
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