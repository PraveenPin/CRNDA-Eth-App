
import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp';
import React from 'react';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Web3 from 'web3';
import SocialNetwork from '../abis/SocialNetwork.json';

const GANACHE_PORT:string = "7545";
const GANACHE_IP_ADDRESS:string = "192.168.0.8";



const shouldDeployContract = async (web3, abi, data, from: string) => {
    // const deployment = new web3.eth.Contract(abi).deploy({ from: data });
    // const deployment = new web3.eth.Contract(abi, data);
        
    // const gas = await deployment.estimateGas();
    // const {
    //   options: { address: contractAddress },
    // } = await deployment.send({ from, gas });
    // return new web3.eth.Contract(abi, contractAddress);
  
    const networkId = await web3.eth.net.getId();
    const networkData = SocialNetwork.networks[networkId];  
    let socialNetwork = null;
    if(networkData){
      //bad to override transactionConfirmationBlocks' value, overridden here for test environment
      socialNetwork = new web3.eth.Contract(SocialNetwork.abi, networkData.address, {transactionConfirmationBlocks: 1});    
    }
    return socialNetwork;
  };

export default function HomePage({ navigation }): JSX.Element{

  const [dataLoading, finishLoading] = React.useState(true);
  const [newsData, setData] = React.useState([]);

    // create new connector
  const connector = useWalletConnect();
  const [account, setAccount] = React.useState("");
  const [user, setUser] = React.useState(0);
  const [message, setMessage] = React.useState<string>('Loading...');
  const [userInfo, setUserInfo] = React.useState({id: 0 ,name: "No User"});
  const web3 = React.useMemo(
    () => new Web3(new Web3.providers.HttpProvider(`http://${GANACHE_IP_ADDRESS}:${GANACHE_PORT}`)),
    [HARDHAT_PORT]
  );

  React.useEffect(() => {
    (async () => {
      // const { address } = await web3.eth.accounts.privateKeyToAccount(HARDHAT_PRIVATE_KEY);
      const accounts = await web3.eth.getAccounts();
      console.log("addres",accounts);
      const contract = await shouldDeployContract(
        web3,
        SocialNetwork.abi,
        SocialNetwork.bytecode,
        "0x6f0a752416d88452e919fddc777564a3a931548c"
      );

      setMessage(await contract.methods.networkName().call());
      setAccount(accounts[0]);

      const user = await contract.methods.getUserIdFromAddress(accounts[0]).call();
      if(!user){
        setUser(web3.utils.hexToNumber(user));
      }
      else{

        let gasReq = await contract.methods.autoCreateUser("Praveen Pinjala - Deployer").estimateGas({ from : accounts[0] });
        const resp = await contract.methods.autoCreateUser("Praveen Pinjala - Deployer").send({from: accounts[0], gas:gasReq});      
        const userInfo = await contract.methods.getUserInfo().call({from : accounts[0]});
        let userObj = {
          id: userInfo[0],
          name: userInfo[1],
          followersCount: userInfo[2],
          followingCount: userInfo[3],
          tipObtained: userInfo[4],
          tipDonated: userInfo[5]
        };
  
        setUserInfo(userObj);             
      }
    })();

    
    fetch('https://newsapi.org/v2/everything?q=tech&apiKey=10b25f941dd343278d9ae7cef2f45cd5')
    .then((response) =>  response.json())
    .then((json) => setData(json.articles))
    .catch(error => console.log(error))
    .finally(() =>  finishLoading(false));


  }, [web3, shouldDeployContract, setMessage, HARDHAT_PRIVATE_KEY, setAccount, setUser, setUserInfo, setData, finishLoading]);

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const signTransaction = React.useCallback(async () => {
    try {
       const accounts = await web3.eth.getAccounts(); 
       const resp = await connector.signTransaction({
        data: '0x',
        from: accounts[0],
        gas: '0x9c40',
        gasPrice: '0x02540be400',
        nonce: '0x0114',
        to: accounts[1],
        value: '0x01',
      });

      console.log("Sign trans", resp);
    } catch (e) {
      console.error(e);
    }
  }, [connector, web3]);


  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);


  const storyItem = ({ item }) => {
    return (
        <TouchableWithoutFeedback
            onPress={ () => { navigation.navigate('NewsDetail', { url: item.url })}}
        >
            <View style={styles.listings}>
                <Text style={styles.title}>{item.title}</Text>
                <Image style={styles.thumbNail} source={{ uri: item.urlToImage }}/>
                <Text style={styles.blurb}>{item.description}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
  };


  return (
    <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
      <Text testID="tid-message">{`${message} - ${userInfo.name}`}</Text>
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet}>
          <Text>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected ? (
        <>
          <TouchableOpacity onPress={signTransaction}>
            <Text>Sign a Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={killSession}>
            <Text>Kill Session</Text>
          </TouchableOpacity>
        </>
      ): <ActivityIndicator/>}

			{dataLoading ? <ActivityIndicator/> : (
				<FlatList
					data={newsData}
					renderItem={storyItem}
					keyExtractor={(item) => item.url}
				/>
			)}
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f4f4f4',
        alignItems:'center'
    },
    center: { alignItems: 'center', justifyContent: 'center' },
    // eslint-disable-next-line react-native/no-color-literals
    white: { backgroundColor: 'white' },
		thumbNail: {
			height: 100,
			width: '98%'
		},
		listings: {
			paddingTop: 15,
			paddingBottom: 25,
			borderBottomColor: 'black',
			borderBottomWidth: 1
		},
		title: {
			paddingBottom: 10,
			fontFamily: 'OpenSans',
			fontWeight: 'bold'
		},
		blurb:{
			fontFamily: 'OpenSans',
			fontStyle: 'italic'
		}
});