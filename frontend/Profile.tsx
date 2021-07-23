import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  PacmanIndicator
} from 'react-native-indicators';
import Identicon from 'identicon.js';
import { getIpfsHashFromBytes32 } from './utils/ipfs';

export default function ProfilePage({ web3, contract, userAddress, userDetails, route, navigation }): JSX.Element{
     
    const [isLoading, setIsLoading] = useState(true);
    const [myPosts, setMyPosts] = useState([]);
    const [accBalance, setAccountBalance] = useState(0.0);
    const [myFollowingIds, setMyFollowingIds] = useState([]);
    const [myFollowerIds, setMyFollowerIds] = useState([]);
    const [followingIdStringList, setFollowingIdStringList] = useState([]);
    const isFocused = useIsFocused();
    

    const fetchAccountBalance = () => {
        web3.eth.getBalance(userAddress).then((accountBalance) => {
            const floatBal = parseFloat(web3.utils.fromWei(accountBalance, 'Ether'));
            console.log("final bal:",floatBal , typeof(floatBal));
            setAccountBalance(floatBal);
        });
    }

    const fetchMyPosts = async () => {    
        const myPosts = await contract.methods.getMyPosts(userDetails.id).call({from: userAddress});
        setMyPosts(myPosts[1]);
    }

    const fetchMySocialNetworkIds = async () => {
        setIsLoading(true);
        const result = await contract.methods.getWholeNetworkForAnId(userDetails.id).call({from: userAddress})        
        console.log("Ner",result);
        setMyFollowingIds(result[0]);
        setMyFollowerIds(result[1]);
        setIsLoading(false);
        convertFollowingIdsFromBNtoStrings();
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
        if(!userDetails || isFocused){
            fetchMyPosts();
            fetchMySocialNetworkIds();
            fetchAccountBalance();
        }
    }, [isFocused]);

    const postItem = ({item}) => {     
        console.log("post",item);
        
        return(
            <TouchableWithoutFeedback
                onPress={ () => navigation.navigate('PostDetail', { myPost: item, postId: item.pid })}
            >
                <View>
                    <Text>{item.authorName} : {item.authorId}</Text>
                    <Image style={{ width: 30, height: 30 }}
                     source={{ uri: `data:image/png;base64,${new Identicon(item.author, 30).toString()}`}}
                    />
                    <View>
                        <Image
                            style={styles.thumbNail}
                            source={{ uri: `https://ipfs.io/ipfs/${getIpfsHashFromBytes32(item.picIpfsHash)}` }}
                        />
                    </View>
                    <View style={styles.productText}>
                        <Text style={styles.title}>{item.content}</Text>
                        <Text style={styles.description}>{item.url}</Text>
                        <Text style={styles.description}>TIPS: {web3.utils.fromWei(item.tipAmount.toString(), 'Ether')} ETH</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
    
    return(
        <View style={styles.container}>
            <ScrollView>
                <Text>{userDetails.name}</Text>
                <Text>Id: {userDetails.id}</Text>
                <Text>Coin Balance: {accBalance} ETH</Text>
                <Text>Followers: {userDetails.followersCount}</Text>
                <Text>Following: {userDetails.followingCount}</Text>
                <Text>Tips: {web3.utils.fromWei(userDetails.tipObtained.toString(), 'Ether')} ETH</Text>
                <Text>Tip Obtained: {web3.utils.fromWei(userDetails.tipObtained.toString(), 'Ether')} ETH</Text>
                <Text>Tip Donated: {web3.utils.fromWei(userDetails.tipDonated.toString(), 'Ether')} ETH</Text>
                {isLoading ? <PacmanIndicator color="black"/> : 
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
                <Text>Posts: </Text>
                <ScrollView>
                    <FlatList
                        data={myPosts}
                        renderItem={postItem}
                        keyExtractor={(item) => item.pid}
                    />
                </ScrollView>
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
    },
    thumbNail: {
        height: 260,
        width: '100%'
    },
    productText:{
        alignItems: 'flex-start',
        paddingLeft:15,
        flex: 1
    },
    title:{
        fontWeight: 'bold',
        paddingBottom: 10,
        fontFamily: 'OpenSans'
    },
    description:{
        textAlign: 'left',
        fontSize: 12,
        fontFamily: 'OpenSans'
    },
});