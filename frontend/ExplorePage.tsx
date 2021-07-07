import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import globalCatalog from './CatalogDB';
import { navigationRef } from './RootNavigation';
import {getIpfsHashFromBytes32} from './utils/ipfs';

export default class ExplorePage extends React.Component<any,{
    catalogData: any, 
    fetchPosts: boolean,
    allPosts: Array<any> }>{
    constructor(props){
        super(props);
        this.state={
            catalogData: globalCatalog,
            fetchPosts: true,
            allPosts: []
        }
    }

    componentDidMount(){      
        this.explorePosts();
    }

    

  explorePosts = async () => {
    const postCount = await this.props.contract.methods.postCount().call(); // this calls the method and returns the postCount
    //call methods just read data from blockchain, costs no gas
    //send methods writes data on blockchain, costs gas
    console.log("Post Count",postCount);
    let newPosts: Array<any> =  [];
    for(var i = 1; i <= postCount; i++){
      let post = await this.props.contract.methods.getPostFromPostId(i).call();
      post.postImage = '';
      fetch(`https://ipfs.io/ipfs/${getIpfsHashFromBytes32(post.picIpfsHash)}`)
      .then(res => res.blob())
      .then(blob => {
          post.postImage = blob;
      });
      newPosts = [...newPosts, post];
    }
    this.setState({ allPosts: newPosts, fetchPosts: false });
  };


    setCatalogData = (data) => {
        this.setState({ catalogData: data });
    }

    render(){
        const {web3} = this.props;

        const postItem = ({item}) => {     
            console.log("post",item);
            
            return(
                <TouchableWithoutFeedback
                    onPress={ () => this.props.navigation.navigate('PostDetail', { id: web3.utils.hexToNumber(item.authorId)})}
                >
                    <View style={styles.products}>
                        <Text>{item.authorName} : {web3.utils.hexToNumber(item.authorId)}</Text>
                        {/* <Image style={{ width: 30, height: 30 }}
                         source={{ uri: `data:image/png;base64,${new Identicon(post.author, 30).toString()}`}}
                        /> */}
                        <View style={styles.productImage}>
                            <Image
                                style={styles.thumbNail}
                                source={{ uri: URL.createObjectURL(item.postImage) }}
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

        

        const storyItem = ({ item }) => {
            return (
                <TouchableWithoutFeedback
                    onPress={ () => { this.props.navigation.goBack()}}
                >
                    <View style={styles.listings}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Image style={styles.thumbNail} source={{ uri: item.urlToImage }}/>
                        <Text style={styles.blurb}>{item.description}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );

        };

        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.allPosts}
                    renderItem={postItem}
                    keyExtractor={(item) => item.modelNumber}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        paddingTop: 25
    },
    products: {
        flexDirection: 'row',
        padding: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        fontSize: 26,
        justifyContent: 'center'
    },
    productImage: {
        flex: 1
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
    listings: {
        paddingTop: 15,
        paddingBottom: 25,
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    blurb:{
        fontFamily: 'OpenSans',
        fontStyle: 'italic'
    }
});