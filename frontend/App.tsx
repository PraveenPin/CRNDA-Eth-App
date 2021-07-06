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
import ProfilePage from './Profile';
import PostDetail from './PostDetail';
import Catalog from './Catalog';
import LoginPage from './LoginPage';

const Stack: any = createStackNavigator();

function App(): JSX.Element {

  let [fontsLoaded] = useFonts({ 
    'OpenSans': require('../assets/fonts/OpenSans-Regular.ttf')
  });
  const connector = useWalletConnect();

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
        <Stack.Navigator initialRouteName="LoginPage" headerMode="screen">
          <Stack.Screen 
            name="LoginPage" 
            options={{
              header: () => <Header headerDisplay="Ethereum-Dapp-SocialNetwork"/>
            }}>            
              {props => <LoginPage {...props} connector={connector} />}
          </Stack.Screen>
          <Stack.Screen 
            name="HomePage" 
            component={HomePage} 
            options={{
              header: () => <Header headerDisplay="Welcome !!!"/>
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
          <Stack.Screen 
            name="Profile" 
            component={ProfilePage} 
            options={{
              header: () => <Header headerDisplay="Profile"/>
            }}
          />
          <Stack.Screen 
            name="PostDetail" 
            component={PostDetail} 
            options={{
              header: () => <Header headerDisplay="PostDetail"/>
            }}
          />
          <Stack.Screen 
            name="Explore" 
            component={Catalog} 
            options={{
              header: () => <Header headerDisplay="Explore"/>
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