import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import localhost from 'react-native-localhost';
import Web3 from 'web3';

import { expo } from '../app.json';
import SocialNetwork from '../abis/SocialNetwork.json';

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  // eslint-disable-next-line react-native/no-color-literals
  white: { backgroundColor: 'white' },
});

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

function App(): JSX.Element {
  const connector = useWalletConnect();
  const [account, setAccount] = React.useState("");
  const [user, setUser] = React.useState(0);
  const [message, setMessage] = React.useState<string>('Loading...');
  const [userInfo, setUserInfo] = React.useState({id: 0 ,name: "No User"});


  const web3 = React.useMemo(
    () => new Web3(new Web3.providers.HttpProvider(`http://192.168.0.8:7545`)),
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
      console.log("User id", user);
      if(!user){
        setUser(web3.utils.hexToNumber(user));
      }
      let gasReq = await contract.methods.autoCreateUser("Praveen Pinjala - Deployer").estimateGas({ from : accounts[0] });
      console.log("res*****",gasReq);
      const resp = await contract.methods.autoCreateUser("Praveen Pinjala - Deployer").send({from: accounts[0], gas:106975});      
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
    })();
  }, [web3, shouldDeployContract, setMessage, HARDHAT_PRIVATE_KEY, setAccount, setUser, setUserInfo]);
  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);
  const signTransaction = React.useCallback(async () => {
    try {
       const resp = await connector.signTransaction({
        data: '0x',
        from: '0xdef61906c3c996e25c089c6c025ff12b15103ba6',
        gas: '0x9c40',
        gasPrice: '0x02540be400',
        nonce: '0x0114',
        to: '0x01779AFC624Ff35dEECDd294C5ac072F68Ee68Eb',
        value: '0x01',
      });

      console.log("Sign trans", resp);
    } catch (e) {
      console.error(e);
    }
  }, [connector]);
  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);
  return (
    <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>
      <Text testID="tid-message">{`${message} - ${userInfo.name}`}</Text>
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet}>
          <Text>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <TouchableOpacity onPress={signTransaction}>
            <Text>Sign a Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={killSession}>
            <Text>Kill Session</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
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