import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableWithoutFeedback, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import {
    PacmanIndicator
  } from 'react-native-indicators';
  import {getIpfsHashFromBytes32} from './utils/ipfs';
import Identicon from 'identicon.js';
import MarqueeText from 'react-native-marquee';

export default class ExplorePage extends React.Component<any,{
    initialSetup: boolean,
    allPosts: Array<any>,
    headerText: string,
    searchKeyWord: string,
    showSearchResults: boolean,
    searchResults: Array<any>,
    tickerData: string
     }>{
    constructor(props){
        super(props);
        this.state={
            initialSetup: true,
            allPosts: [],
            headerText: "All Posts",
            searchKeyWord: '',
            showSearchResults: false,
            searchResults: [],
            tickerData: undefined
        }
    }

    async componentDidMount(){
        await this.explorePosts();
        this.fetchTickerExchangeData();
    }

    

  explorePosts = async () => {
    const postCount = await this.props.contract.methods.postCount().call(); // this calls the method and returns the postCount
    //call methods just read data from blockchain, costs no gas
    //send methods writes data on blockchain, costs gas
    // console.log("Post Count",postCount);
    let newPosts: Array<any> =  [];
    for(var i = 1; i <= postCount; i++){
      let post = await this.props.contract.methods.getPostFromPostId(i).call();
      newPosts = [...newPosts, post];
    }
    this.setState({ allPosts: newPosts, initialSetup: false });
  };

  fetchTickerExchangeData = () => {
    this.setState({ initialSetup: true });
    fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR,INR")
    .then(res => res.json())
    .then( result => {
      const arr = "1 ETH = " + result.BTC + " BTC,   " + result.USD + " USD,   " + result.INR + " INR,   " + result.EUR + " EUR   ";
      this.setState({ tickerData: arr, initialSetup: false })
    });
  }


    setKeyWordForSearch = (keyWord) => {
        this.setState({ searchKeyWord: keyWord });
    }

    showKeyWordPosts = () => {        
        this.props.contract.methods.getPostsFromTag(this.state.searchKeyWord).call()
        .then((result) => {
        console.log("TAGS",result);
        this.setState({ showSearchResults: true, headerText: `Posts with keyword ${this.state.searchKeyWord}`, searchResults: result });
        });
    }

    clearSearchResults = () => {
        this.setState({ showSearchResults: false, searchKeyWord: '', headerText: 'All Posts' });
    }

    render(){
        const {web3} = this.props;

        const postItem = ({item}) => {     
            console.log("post",item);
            
            return(
                <TouchableWithoutFeedback
                    onPress={ () => this.props.navigation.navigate('PostDetail', { myPost: item, postId: item.pid })}
                >
                    <View style={styles.products}>
                        <Text>{item.authorName} : {item.authorId}</Text>
                        <Image style={{ width: 30, height: 30 }}
                         source={{ uri: `data:image/png;base64,${new Identicon(item.author, 30).toString()}`}}
                        />
                        <View style={styles.productImage}>
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
        
        console.log("Ticker data",this.state.tickerData);

        if(this.state.initialSetup){
            return( <PacmanIndicator color="black"/> );
        }

        return(
            <View style={styles.container}>
                <View>                    
                    <MarqueeText
                    style={{ fontSize: 24 }}
                    duration={5000}
                    marqueeOnStart
                    loop
                    marqueeDelay={1000}
                    marqueeResetDelay={1000}
                    useNativeDriver={true}
                    >
                    {this.state.tickerData}
                    </MarqueeText>
                </View>
                <View style={styles.topSubContainer}>
                    <TextInput
                        placeholder="Type a keyword..."
                        onChangeText={ val => this.setKeyWordForSearch(val)}
                        value={this.state.searchKeyWord}
                    />
                    <TouchableOpacity
                            // style={styles.button}
                            onPress={this.showKeyWordPosts}
                        >
                            <Text>Search</Text>
                        </TouchableOpacity>
                    {this.state.showSearchResults && (
                    <TouchableOpacity
                        // style={styles.button}
                        onPress={this.clearSearchResults}
                    >
                        <Text>Clear Results</Text>
                    </TouchableOpacity>)}
                </View>
                <Text>{this.state.headerText}</Text>
                <ScrollView>
                    <FlatList
                        data={ this.state.showSearchResults ? this.state.searchResults : this.state.allPosts}
                        renderItem={postItem}
                        keyExtractor={(item) => item.pid}
                    />
                </ScrollView>
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
    },
    topSubContainer: {
        display: 'flex',
        flexDirection: 'row'        
    }
});