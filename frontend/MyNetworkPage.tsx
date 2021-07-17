import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import AppLoading from 'expo-app-loading';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }

export default class MyNetworkPage extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            switch: 0, //0 for followers, 1 for following
            activeTab: 'Followers',
            isLoading: true,
            followingData: [],
            followersData: [],
            userExtraInfo: {},
            followerIds: this.props.route.params.followerIds,
            followingIds: this.props.route.params.followingIds,
            selectedId: null        
        }
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData = () => {        
        this.getFollowersData();
        this.getFollowingData();
        this.reloadValues();
    }

    componentWillReceiveProps(newProps){
        console.log("Old->", this.props.route.params, newProps.route.params)
        this.setState({ selectedId: null, followerIds: newProps.route.params.followerIds,
             followingIds: newProps.route.params.followingIds }, () => this.fetchData());        
    }

    setSwitch = (val) => {
        this.setState({ switch: val }, () => this.reloadValues());
    }

  getFollowersData = async () => {
    this.setState({ isLoading: true });
    let totalFollowersData = [];
    for(let i = 0; i<this.state.followerIds.length;i++){
      console.log("Fetching followers data 11111111",totalFollowersData);
      let userInfo = await this.props.contract.methods.getUserData(this.state.followerIds[i]).call({from: this.props.userAddress});
      totalFollowersData = [...totalFollowersData, userInfo];
    }
    this.setState({ followersData : totalFollowersData, isLoading: false });
  }

  getFollowingData = async () => {
    this.setState({ isLoading: true });
    let totalFollowingData = [];
    for(let i = 0; i<this.state.followingIds.length;i++){
      let userInfo = await this.props.contract.methods.getUserData(this.state.followingIds[i]).call({from: this.props.userAddress});
      totalFollowingData = [...totalFollowingData, userInfo];
    }
    this.setState({ followingData : totalFollowingData, isLoading: false });
  }

    unFollowAuthor = (authorId) => {
        this.props.contract.methods.unFollowAuthor(authorId).send({ from: this.props.userAddress })
            .once('receipt', (receipt) => {
            console.log("r:",receipt);
        });
        //notification for following
    }

    followAuthor = (authorId) => {
        this.props.contract.methods.followAuthor(authorId).send({ from: this.props.userAddress })
            .once('receipt', (receipt) => {
            console.log("r:",receipt);
        });
        //notification for following
    }  

    reloadValues = () => {
        const newActiveTab = this.state.switch === 0 ? 'Followers' : "Following";
        this.setState({ activeTab: newActiveTab });
    }

    expandMenu = (itemId) => {
        const oldselectedId = this.state.selectedId;
        if(oldselectedId !== itemId){
            this.setState({ selectedId: itemId });
        }
        else{
            this.setState({ selectedId: -1 });
        }
    }

    render(){
    
        const abbrevatedInfo = ({ item }) => {
            
            const itemId = this.props.web3.utils.hexToNumber(item[0]);
            const expandMenu = itemId === this.state.selectedId ? true: false

            return (
                <TouchableOpacity
                    onPress={ () => this.expandMenu(itemId)}
                >                    
                    <View>
                        <Text>{item[1]}</Text>
                        <Text>Id: {itemId}</Text>
                        <Text>Followers: {item[2]}</Text>
                        <Text>Following: {this.props.web3.utils.hexToNumberString(item[3])}</Text>
                        {expandMenu && (
                            <View>
                                <Text>Tip Obtained: {this.props.web3.utils.fromWei(item[4].toString(), 'Ether')} ETH</Text>
                                <Text>Tip Donated: {this.props.web3.utils.fromWei(item[5].toString(), 'Ether')} ETH</Text>
                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.navigate('UserPosts', {
                                        userId: item[0]
                                    })}
                                >
                                    <Text>Open Profile</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        )}
                    </View> 
                </TouchableOpacity>
            );
        };

        return(
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.setSwitch(0)}
                >
                    <Text>Followers List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.setSwitch(1)}
                >
                    <Text>Following List</Text>
                </TouchableOpacity>
                <Text>{this.state.activeTab} List</Text>                
                <ScrollView>
                    <FlatList
                        data={this.state.switch === 0 ? this.state.followersData : this.state.followingData }
                        renderItem={abbrevatedInfo}
                        keyExtractor={(item) => item.id}
                        extraData={this.state.selectedId}
                    />
                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    tabs:{
        display: 'flex',
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4'
    },
    button:{
        padding: 15
    }
});


