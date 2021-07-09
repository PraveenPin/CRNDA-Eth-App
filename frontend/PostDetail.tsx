import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {getIpfsHashFromBytes32} from './utils/ipfs';
import AppLoading from 'expo-app-loading';
import Identicon from 'identicon.js';

export default function PostDetail({ userAddress, contract, web3, route, navigation }){
    const { myPost, postId } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [myFollowingIds, setMyFollowing] = useState([]);
    const [myFollowerIds, setMyFollowers] = useState([]);
    const [followingIdStringList, setFollowingIdStringList] = useState([]);
    const [tip, setTip] = useState("");
    const [tempTip, setTempTip] = useState("");
    const [post, setPost] = useState(myPost);
    const isFocused = useIsFocused();

    useEffect(() => {
        setup();
    },[isFocused]);
    

    const setup = async (reload = false) => {
        setIsLoading(true);
        if(reload){   
            const post = await contract.methods.getPostFromPostId(postId).call();
            console.log("ReFetching post **************************", post);
            setPost(post);
        }
        contract.methods.getAllFollowingIds().call({from: userAddress})
            .then((result) => {
                setMyFollowing(result[0]);
                setMyFollowers(result[1]);
            });
            
            let followingIdStringList = [];
            myFollowingIds.map((idBN) => {
              followingIdStringList.push(idBN.toString());
            });
            setFollowingIdStringList(followingIdStringList);
            setIsLoading(false);
    }

    const followAuthor = async (authorId) => {
        const TRANSFER_GAS_ESTIMATION = await contract.methods.followAuthor(authorId).estimateGas({ from : userAddress });
        console.log("Gas for following author",TRANSFER_GAS_ESTIMATION);
        contract.methods.followAuthor(authorId).send({ from: userAddress, gas: TRANSFER_GAS_ESTIMATION })
        .once('receipt', (receipt) => {
          console.log("r:",receipt);
          setup(true);
        });
        //notification for following
    }

    const unFollowAuthor = async (authorId) => {
        const TRANSFER_GAS_ESTIMATION = await contract.methods.unFollowAuthor(authorId).estimateGas({ from : userAddress });
        console.log("Gas for unfollowing author",TRANSFER_GAS_ESTIMATION);
        contract.methods.unFollowAuthor(authorId).send({ from: userAddress, gas: TRANSFER_GAS_ESTIMATION })
        .once('receipt', (receipt) => {
            console.log("r:",receipt);
            setup(true);
        });
        //notification for following
    }

    const tipAPost = async (id, tipAmount) => {      
        setIsLoading(true);
        const TRANSFER_GAS_ESTIMATION = await contract.methods.tipAPost(id).estimateGas({ from : userAddress, value: tipAmount});
        console.log("Gas for tipping author",TRANSFER_GAS_ESTIMATION);
        contract.methods.tipAPost(id).send({ from: userAddress, value: tipAmount, gas: TRANSFER_GAS_ESTIMATION }).
        once('receipt', (receipt) => {
            setIsLoading(false);
            setTempTip('');
            setTip('');
            setup(true);
        });
    }


    return (
        <View style={styles.container}>
            {/* <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity> */}
            {isLoading ? <AppLoading/> :
            (<ScrollView>
                <Text>{post.authorName} : {web3.utils.hexToNumber(post.authorId)}</Text>
                <Image style={{ width: 30, height: 30 }}
                    source={{ uri: `data:image/png;base64,${new Identicon(post.author, 30).toString()}`}}
                />
                <Image
                    style={styles.thumbNail}
                    source={{ uri: `https://ipfs.io/ipfs/${getIpfsHashFromBytes32(post.picIpfsHash)}` }}
                />
                <Text style={styles.title}>{post.content}</Text>
                <Text style={styles.description}>{post.url}</Text>
                <Text style={styles.description}>TIPS: {web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH</Text>
                <Text style={styles.description}>Donate Ether - </Text>
                <TextInput style={styles.input}
                    onChangeText={ val => {
                        const regex = new RegExp(/^[0-9]*\.?[0-9]*$/);
                        if(regex.test(val)){
                            setTip(web3.utils.toWei(val, 'Ether'));
                        }
                        setTempTip(val);
                    }}
                    value={tempTip}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => tipAPost(post.authorId,Number.parseFloat(tip))}
                >
                    <Text style={styles.buttonText}>Tip Author</Text>
                </TouchableOpacity>
                {(followingIdStringList.length > 0 && followingIdStringList.indexOf(post.authorId.toString()) > -1) ?
                (<TouchableOpacity
                    style={styles.button}
                    onPress={() => unFollowAuthor(post.authorId)}
                    >
                        <Text style={styles.buttonText}>Unfollow Author</Text>
                    </TouchableOpacity>)
                :(userAddress.localeCompare(post.author) !== 0 && (<TouchableOpacity
                    style={styles.button}
                    onPress={() => followAuthor(post.authorId)}
                >
                    <Text style={styles.buttonText}>Follow Author</Text>
                </TouchableOpacity>))}
            </ScrollView>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        marginBottom: 100
    },
    button: {
        padding: 20,
    },
    buttonText:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
    },
    model: {
        fontFamily: 'OpenSans',
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
    input: {
        height: 40,
        width: 250,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 26,
        fontFamily: 'OpenSans',
    },
    productImage: {
        height: 250,
        width: '100%'
    },
    description: {
        paddingTop: 10
    }
});