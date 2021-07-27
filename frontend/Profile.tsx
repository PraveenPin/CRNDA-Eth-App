import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  PacmanIndicator
} from 'react-native-indicators';
import Identicon from 'identicon.js';

import UserDetails from './DataTypes';
import { getIpfsHashFromBytes32 } from './utils/ipfs';

export default function ProfilePage({ web3, contract, userAddress, route, navigation }): JSX.Element{
     
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({} as UserDetails);
    const [myPosts, setMyPosts] = useState([]);
    const [accBalance, setAccountBalance] = useState(0.0);
    const [myFollowingIds, setMyFollowingIds] = useState([]);
    const [myFollowerIds, setMyFollowerIds] = useState([]);
    const [followingIdStringList, setFollowingIdStringList] = useState([]);
    const isFocused = useIsFocused();
    

    const fetchUserDetails = async () => {
        const userInfo = await contract.methods.getUserInfo().call({from: userAddress});
            const userDetails: UserDetails = {
                id: userInfo[0],
                name: userInfo[1],
                followersCount: userInfo[2],
                followingCount: userInfo[3],
                tipObtained: userInfo[4],
                tipDonated: userInfo[5]
            };
            setUserDetails(userDetails);

            await fetchMyPosts(userDetails);
            await fetchMySocialNetworkIds(userDetails);
            fetchAccountBalance();
            setIsLoading(false);
    }

    const fetchAccountBalance = () => {
        web3.eth.getBalance(userAddress).then((accountBalance) => {
            const floatBal = parseFloat(web3.utils.fromWei(accountBalance, 'Ether'));
            console.log("final bal:",floatBal , typeof(floatBal));
            setAccountBalance(floatBal);
        });
    }

    const fetchMyPosts = async (userDetails: UserDetails) => {    
        const myPosts = await contract.methods.getMyPosts(userDetails.id).call({from: userAddress});
        setMyPosts(myPosts[1]);
    }

    const fetchMySocialNetworkIds = async (userDetails: UserDetails) => {
        setIsLoading(true);
        const result = await contract.methods.getWholeNetworkForAnId(userDetails.id).call({from: userAddress});
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
        fetchUserDetails();
    }, [isFocused]);

    const postItem = ({item}) => {     
        console.log("post",item);
        
        return(
            <TouchableWithoutFeedback
                onPress={ () => navigation.navigate('PostDetail', { myPost: item, postId: item.pid })}
            >                
                <View style={styles.products}>
                    <View style={styles.productText}>
                        <Image style={{ width: 30, height: 30 }}
                         source={{ uri: `data:image/png;base64,${new Identicon(item.author, 30).toString()}`}}
                        />
                        <Text>{item.authorName} : {item.authorId}</Text>
                        <Text style={styles.title}>{item.content}</Text>
                        <Text style={styles.description}>{item.url}</Text>
                        <Text style={styles.description}>TIPS: {web3.utils.fromWei(item.tipAmount.toString(), 'Ether')} ETH</Text>
                    </View>
                    {!!item.picIpfsHash && (<View style={styles.productImage}>
                        <Image
                            style={styles.thumbNail}
                            source={{ uri: `https://ipfs.io/ipfs/${getIpfsHashFromBytes32(item.picIpfsHash)}` }}
                        />
                    </View>)}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    if(isLoading){
        return (<PacmanIndicator />);
    }
    
    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.userName}>{userDetails.name}</Text>
                <Text style={styles.outerText}>
                    Id:
                    <Text style={styles.balance}> {userDetails.id}</Text>
                </Text>
                <Text style={styles.outerText}>
                    Coin Balance: 
                    <Text style={styles.balance}> {accBalance} ETH</Text>
                </Text>
                <View style={styles.followContainer}>
                    <View style={styles.followBlock}>
                        <Text style={styles.followHeader}>Followers:</Text>
                        <Text style={styles.followText}> {userDetails.followersCount}</Text>
                    </View>
                    <View style={styles.followBlock}>
                        <Text style={styles.followHeader}>Following:</Text>                        
                        <Text style={styles.followText}> {userDetails.followingCount}</Text>
                    </View>
                </View>
                <View style={styles.followContainer}>
                    <View style={styles.followBlock}>
                        <Text style={styles.followHeader}>Tip Obtained:</Text>
                        <Text style={styles.followText}> {web3.utils.fromWei(userDetails.tipObtained.toString(), 'Ether')}</Text>
                    </View>
                    <View style={styles.followBlock}>
                        <Text style={styles.followHeader}>Tip Donated:</Text>                        
                        <Text style={styles.followText}> {web3.utils.fromWei(userDetails.tipDonated.toString(), 'Ether')}</Text>
                    </View>
                </View>                
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
                <View>
                <Text style={styles.postsHeader}>{myPosts.length > 0 ? 'Posts :' : 'No Posts Yet'}</Text>
                    <FlatList
                        data={myPosts}
                        renderItem={postItem}
                        keyExtractor={(item) => item.pid}
                    />
                </View>
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
        justifyContent: 'flex-start',
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
        padding: 16,
        color: 'white'
    },
    button:{
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 12,
        width: '100%',
        backgroundColor: '#403e3e',
        alignItems: 'center',
    },
    products: {
        flexDirection: 'row',
        padding: 12,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        fontSize: 26,
        justifyContent: 'center',
        width: '100%'
    },
    productImage: {
        flex: 1,
        width: '45%'
    },
    thumbNail: {
        height: 200,
        width: 180
    },
    productText:{
        alignItems: 'flex-start',
        flex: 1,
        width: '55%'
    },
    scrollContainer: { width: '100%'},
    userName: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    outerText: {
        marginTop: 8,
        fontSize: 18,
        color: '#403e3e'
    },    
    innerText: {       
        fontSize: 20
    },
    balance: {
        marginTop: 8,
        fontSize: 22,
        color: '#212121'   
    },
    followContainer: {
        marginTop: 8,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    followBlock: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    followHeader: {
        fontSize: 18,
        color: '#403e3e'
    },
    followText: {
        width: '50%',
        // padding: 8,
        fontSize: 22,
    },
    postsContainer: {
        backgroundColor: '#fafafa'
    },
    status:{
        paddingTop: 10,
        paddingBottom: 15
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
    postsHeader: {
        marginTop: 8,
        fontSize: 28,
        fontWeight: 'bold'
    }
});