import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import MyNetworkPage from './MyNetworkPage';

export default function ProfilePage({ web3, contract, userAddress, userDetails, route, navigation }): JSX.Element{
     
    const [isLoading, setIsLoading] = useState(true);
    const [myPosts, setMyPosts] = useState([]);
    const [accBalance, setAccountBalance] = useState(0.0);
    const [myFollowingIds, setMyFollowingIds] = useState([]);
    const [myFollowerIds, setMyFollowerIds] = useState([]);
    const [followingIdStringList, setFollowingIdStringList] = useState([]);
    const [submitted, trySubmit] = useState(false);
    const isFocused = useIsFocused();

    const { model, modelNumber } = route.params;

    const fetchAccountBalance = () => {
        web3.eth.getBalance(userAddress).then((accountBalance) => {
            const floatBal = parseFloat(web3.utils.fromWei(accountBalance, 'Ether'));
            console.log("final bal:",floatBal , typeof(floatBal));
            setAccountBalance(floatBal);
        });
    }

    const fetchMyPosts = async () => {    
        const myPosts = await contract.methods.getMyPosts(userDetails.id).call({from: userAddress});
        setMyPosts(myPosts);
    }

    const fetchMySocialNetworkIds = () => {
        setIsLoading(true);
        contract.methods.getWholeNetworkForAnId(userDetails.id).call({from: userAddress})
        .then((result) => {
            console.log("Ner",result);
            setMyFollowingIds(result[0]);
            setMyFollowerIds(result[1]);
            setIsLoading(false);
            convertFollowingIdsFromBNtoStrings();
        });
    }

    const convertFollowingIdsFromBNtoStrings = () => {
        setIsLoading(true);
        let followingIdStringList = [];
        myFollowingIds.map((idBN,index) => {
            followingIdStringList.push(idBN.toString());
        });
        setFollowingIdStringList(followingIdStringList);
        setIsLoading(false);
    }

    const getAllHistory = () => {    
        contract.events.PostCreated({
            filter: {}, // Using an array means OR: e.g. 20 or 23
            fromBlock: 0
        }, function(error, event){ 
        
            console.log(event); 
            })
            .on('data', function(event){
                console.log("Inside events:", event); 
                this.setState({ logMessage: "Hide All Logs"});// same results as the optional callback above
            })
            .on('changed', function(event){
                // remove event from local database
            })
            .on('error', console.error);
    }

    useEffect( () => {        
        if(!!userDetails){
            fetchMyPosts();
            fetchMySocialNetworkIds();
            fetchAccountBalance();
        }
    }, [isFocused]);
    
    return(
        <View style={styles.container}>
            <ScrollView>
                <Text>{userDetails.name}</Text>
                <Text>Id: {web3.utils.hexToNumber(userDetails.id)}</Text>
                <Text>Coin Balance: {accBalance} ETH</Text>
                <Text>Followers: {web3.utils.hexToNumber(userDetails.followersCount)}</Text>
                <Text>Following: {web3.utils.hexToNumberString(userDetails.followingCount)}</Text>
                <Text>Tips: {web3.utils.fromWei(userDetails.tipObtained.toString(), 'Ether')} ETH</Text>
                <Text>Tip Obtained: {web3.utils.fromWei(userDetails.tipObtained.toString(), 'Ether')} ETH</Text>
                <Text>Tip Donated: {web3.utils.fromWei(userDetails.tipDonated.toString(), 'Ether')} ETH</Text>
                {isLoading ? <AppLoading/> : 
                 (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('MyNetwork', { 
                            followerIds: myFollowerIds,
                            followingIds: myFollowingIds,
                            followingIdStringList: followingIdStringList,                            
                         })}
                    >
                        <Text style={styles.label}>View your network</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor:  '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
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
    req: {
        paddingTop: 10,
        fontStyle: 'italic',
        fontFamily: 'OpenSans'
    },
    mutli:{
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'OpenSans',
        width: 300
    },
    button:{
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingTop: 10
    },
    status:{
        paddingTop: 10,
        paddingBottom: 15
    }
});