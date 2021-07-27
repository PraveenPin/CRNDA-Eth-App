import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
    PacmanIndicator
  } from 'react-native-indicators';import Identicon from 'identicon.js';
import { getIpfsHashFromBytes32 } from './utils/ipfs';

export default function ProfilePage({ web3, contract, userAddress, route, navigation }): JSX.Element{
     
    const { userId } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [accBalance, setAccountBalance] = useState(0.0);
    const [myFollowingIds, setMyFollowingIds] = useState([]);
    const [myFollowerIds, setMyFollowerIds] = useState([]);
    const [followingIdStringList, setFollowingIdStringList] = useState([]);
    const [userFullDetails, setUserFullDetails] = useState(undefined);
    const isFocused = useIsFocused();

    const fetchMySocialNetworkIds = async () => {
        setIsLoading(true);
        const result = await contract.methods.getWholeNetworkForAnId(userId).call({from: userAddress})        
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

    const getUserInfo = async (id: Number) => {
        const userInfo = await contract.methods.getUserData(id).call({from: userAddress});
        console.log("User Data:", userInfo);
        setUserFullDetails({
            id: userInfo[0],
            name: userInfo[1],
            followersCount: userInfo[2],
            followingCount: userInfo[3],
            tipObtained: userInfo[4],
            tipDonated: userInfo[5]
        });
    }

    const getUserPosts = async (id: Number) => {
        const userPosts = await contract.methods.getMyPosts(id).call({from: userAddress});
        setUserPosts(userPosts[1]);
    }

    useEffect( () => {        
        getUserInfo(userId);
        getUserPosts(userId);
        fetchMySocialNetworkIds();
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
    
    return(
        <View style={styles.container}>
            {!!userFullDetails ? (
                
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.userName}>{userFullDetails.name}</Text>
                {/* <Text style={styles.userId}>Id: {userFullDetails.id}</Text> */}
                {/* <Text>Coin Balance: {accBalance} ETH</Text> */}
                <View style={styles.followContainer}>
                    <View style={styles.followBlock}>
                        <Text style={styles.followHeader}>Followers:</Text>
                        <Text style={styles.followText}> {userFullDetails.followersCount}</Text>
                    </View>
                    <View style={styles.followBlock}>
                        <Text style={styles.followHeader}>Following:</Text>                        
                        <Text style={styles.followText}> {userFullDetails.followingCount}</Text>
                    </View>
                </View>
                {/* <Text>Tips: {web3.utils.fromWei(userFullDetails.tipObtained.toString(), 'Ether')} ETH</Text> */}
                {/* <Text>Tip Obtained: {web3.utils.fromWei(userFullDetails.tipObtained.toString(), 'Ether')} ETH</Text> */}
                {/* <Text>Tip Donated: {web3.utils.fromWei(userFullDetails.tipDonated.toString(), 'Ether')} ETH</Text> */}
                {isLoading ? <PacmanIndicator /> : 
                (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('MyNetwork', {
                            followerIds: myFollowerIds,
                            followingIds: myFollowingIds,
                            followingIdStringList: followingIdStringList,                            
                        })}
                    >
                        <Text style={styles.label}>View their network</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.postsContainer}>
                    <Text style={styles.postsHeader}>{userPosts.length > 0 ? 'Posts :' : 'No Posts Yet'}</Text>                
                    <FlatList
                        data={userPosts}
                        renderItem={postItem}
                        keyExtractor={(item) => item.modelNumber}
                    />
                </View>
            </ScrollView>
            ) : (<PacmanIndicator color="black"/>)}
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
    title:{
        marginTop: 8,
        paddingBottom: 10,
        fontFamily: 'OpenSans',
        fontSize: 18
    },
    description:{
        textAlign: 'left',
        fontSize: 14,
        marginTop: 8,
        fontFamily: 'OpenSans'
    },
    scrollContainer: { width: '100%'},
    userName: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    userId: {
        marginTop: 8,
        fontSize: 22
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
    postsHeader: {
        marginTop: 8,
        fontSize: 28,
        fontWeight: 'bold'
    }
});