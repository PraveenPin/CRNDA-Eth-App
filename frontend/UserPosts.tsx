import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import Identicon from 'identicon.js';
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

    const getUserInfo = async (id) => {
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

    const getUserPosts = async (id) => {
        const userPosts = await contract.methods.getMyPosts(id).call({from: userAddress});
        setUserPosts(userPosts);
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
                <View>
                    <Text>{item.authorName} : {web3.utils.hexToNumber(item.authorId)}</Text>
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
            {!!userFullDetails && (
                
            <ScrollView>
                <Text>{userFullDetails.name}</Text>
                <Text>Id: {web3.utils.hexToNumber(userFullDetails.id)}</Text>
                <Text>Coin Balance: {accBalance} ETH</Text>
                <Text>Followers: {web3.utils.hexToNumber(userFullDetails.followersCount)}</Text>
                <Text>Following: {web3.utils.hexToNumberString(userFullDetails.followingCount)}</Text>
                <Text>Tips: {web3.utils.fromWei(userFullDetails.tipObtained.toString(), 'Ether')} ETH</Text>
                <Text>Tip Obtained: {web3.utils.fromWei(userFullDetails.tipObtained.toString(), 'Ether')} ETH</Text>
                <Text>Tip Donated: {web3.utils.fromWei(userFullDetails.tipDonated.toString(), 'Ether')} ETH</Text>
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
                        <Text style={styles.label}>View their network</Text>
                    </TouchableOpacity>
                )}
                <FlatList
                    data={userPosts}
                    renderItem={postItem}
                    keyExtractor={(item) => item.modelNumber}
                />
            </ScrollView>
            )}
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
    status:{
        paddingTop: 10,
        paddingBottom: 15
    }
});