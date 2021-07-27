import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DownArrow from '../assets/image/downArrow.png';
import UpArrow from '../assets/image/upArrow.png';

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

    setSwitch = (val: Number) => {
        this.setState({ switch: val }, () => this.reloadValues());
    }

    getFollowersData = async () => {
        this.setState({ isLoading: true });
        let totalFollowersData = [];
        for(let i = 0; i<this.state.followerIds.length;i++){
        let userInfo = await this.props.contract.methods.getUserData(this.state.followerIds[i]).call({from: this.props.userAddress});
        totalFollowersData = [...totalFollowersData, userInfo];
        }
        console.log("Fetching followers data 11111111",totalFollowersData);
        this.setState({ followersData : totalFollowersData, isLoading: false });
    }

    getFollowingData = async () => {
        this.setState({ isLoading: true });
        let totalFollowingData = [];
        for(let i = 0; i<this.state.followingIds.length;i++){
        let userInfo = await this.props.contract.methods.getUserData(this.state.followingIds[i]).call({from: this.props.userAddress});
        totalFollowingData = [...totalFollowingData, userInfo];
        }
        console.log("Fetching following data 11111111",totalFollowingData);
        this.setState({ followingData : totalFollowingData, isLoading: false });
    }

    unFollowAuthor = (authorId: Number) => {
        this.props.contract.methods.unFollowAuthor(authorId).send({ from: this.props.userAddress })
            .once('receipt', (receipt) => {
            console.log("r:",receipt);
        });
        //notification for following
    }

    followAuthor = (authorId : Number) => {
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

    expandMenu = (itemId : Number) => {
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
            const itemId = item[0];
            const expandMenu = itemId === this.state.selectedId ? true: false

            return (
                <TouchableOpacity
                    onPress={ () => this.expandMenu(itemId)}
                >                    
                    <View>
                        <View style={styles.nameIcon}>
                            <Text style={styles.userName}>{item[1]}</Text>
                            <Image style={styles.expandIcon} source={expandMenu ? UpArrow : DownArrow}/>
                        </View>
                        <View style={styles.followContainer}>
                            <View style={styles.followBlock}>
                                <Text style={styles.followHeader}>Followers:</Text>
                                <Text style={styles.followText}> {item[2]}</Text>
                            </View>
                            <View style={styles.followBlock}>
                                <Text style={styles.followHeader}>Following:</Text>                        
                                <Text style={styles.followText}> {item[3]}</Text>
                            </View>
                        </View>
                        {expandMenu && (
                            <View>
                                <View style={styles.followContainer}>
                                    <View style={styles.followBlock}>
                                        <Text style={styles.followHeader}>Tip Obtained:</Text>
                                        <Text style={styles.followText}> {this.props.web3.utils.fromWei(item[4].toString(), 'Ether')}</Text>
                                    </View>
                                    <View style={styles.followBlock}>
                                        <Text style={styles.followHeader}>Tip Donated:</Text>                        
                                        <Text style={styles.followText}> {this.props.web3.utils.fromWei(item[5].toString(), 'Ether')}</Text>
                                    </View>
                                </View>
                                <View style={styles.touchContainer}>
                                    <TouchableWithoutFeedback
                                        onPress={() => this.props.navigation.navigate('UserPosts', {
                                            userId: item[0]
                                        })}
                                    >
                                        <Text style={styles.label}>Open Profile</Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        )}
                    </View> 
                </TouchableOpacity>
            );
        };

        const isActiveTabFollowers = this.state.activeTab === 'Followers';
        const followersTabHeaderStyles = {
           fontSize: isActiveTabFollowers ? 24 : 18,
           fontWeight: isActiveTabFollowers ? 'bold': 'normal',
        }
        const followingTabHeaderStyles = {
           fontSize: !isActiveTabFollowers ? 24 : 18,
           fontWeight: !isActiveTabFollowers ? 'bold': 'normal'
        }

        return(
            <View style={styles.container}>
                <View style={styles.tabContainer}>                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.setSwitch(0)}
                    >
                        <Text style={[followersTabHeaderStyles]}>Followers List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.setSwitch(1)}
                    >
                        <Text style={[followingTabHeaderStyles]}>Following List</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.listContainer}>              
                    <ScrollView>
                        <FlatList
                            data={this.state.switch === 0 ? this.state.followersData : this.state.followingData }
                            renderItem={abbrevatedInfo}
                            keyExtractor={(item) => item.id}
                            extraData={this.state.selectedId}
                        />
                    </ScrollView>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
    },
    tabContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        backgroundColor: '#f4f4f4',
        borderBottomWidth: 1
    },
    button:{
        alignItems: 'center',
        width: '50%',
        marginBottom: 12
    },
    listContainer: {
        width: '100%',
        padding: 8,
        backgroundColor : '#d9d9d9',
        shadowColor: 'grey',
        shadowOpacity: 0.5,
        shadowRadius : 5
    },
    tabHeader: {
        fontSize: 22,

    },
    followContainer: {
        marginTop: 12,
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
    nameIcon: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userName: {        
        fontSize: 26,
        fontWeight: 'bold'
    },
    expandIcon:{
        width: 24, height: 24,
    },
    touchContainer: {
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 12,
        width: '100%',
        backgroundColor: '#403e3e',
        alignItems: 'center',
    },
    label: {
        fontFamily: 'OpenSans',
        fontSize: 18,
        padding: 16,
        color: 'white'
    },
});


