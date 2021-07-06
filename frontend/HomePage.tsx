
import { HARDHAT_PORT, HARDHAT_PRIVATE_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp';
import React from 'react';
import { StyleSheet, Text, Platform, View, ActivityIndicator, Image, Button } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import TextAreaInput from './components/TextAreaInput';
import Form from './components/Form';
import validation from './utils/validation';
import { FormData, PostFormData } from './DataTypes';
import { useForm } from 'react-hook-form';
import ipfs, { getBytes32FromIpfsHash } from './utils/ipfs';
import * as ImagePicker from 'expo-image-picker';
// import {useIpfs} from '../utils/ipfsC';

export default function HomePage({ route, navigation }): JSX.Element{

  const [image, setImage] = React.useState(null);
  const [fetchPosts, setFetchPosts] = React.useState(true);
  const [allPosts, setAllPosts] = React.useState([]);
  // const [imageBuffer, setImageBuffer] = React.useState(undefined);
  const [isLoading, changeLoading] = React.useState<boolean>(true);

  const { userAddress, contract } = route.params;

  const explorePosts = async () => {
    const postCount = await contract.methods.postCount().call(); // this calls the method and returns the postCount
    //call methods just read data from blockchain, costs no gas
    //send methods writes data on blockchain, costs gas
    console.log("Post Count",postCount);
    let newPosts: Array<any> =  [];
    for(var i = 1; i <= postCount; i++){
      let post = await contract.methods.getPostFromPostId(i).call();
      newPosts.push(post);
    }
    console.log("all",newPosts);
    setAllPosts(newPosts);
    setFetchPosts(false);
  };

  React.useEffect(() => {    
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
    if(fetchPosts){      
      explorePosts();
    }
  },[fetchPosts]);

  const createAPost = React.useCallback( async (content : string, url : string, imageHash : string ) => {
      const TRANSFER_GAS_ESTIMATION = await contract.methods.createPost(content, url, imageHash).estimateGas({ from : userAddress });
      // const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas for creating this post",TRANSFER_GAS_ESTIMATION, content, url, imageHash);
      await contract.methods.createPost(content, url, imageHash).send({ from: userAddress, gas: TRANSFER_GAS_ESTIMATION })
      .once('receipt', (receipt) => {
          console.log("receipt",receipt);
          setFetchPosts(true);
      });
  },[]);

  const storyItem = ({ item }) => {
    return (
        <TouchableWithoutFeedback
            onPress={ () => { navigation.goBack()}}
        >
            <View style={styles.listings}>
                <Text style={styles.title}>{item.title}</Text>
                <Image style={styles.thumbNail} source={{ uri: item.urlToImage }}/>
                <Text style={styles.blurb}>{item.description}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

  };



//   <FlatList
//    data={newsData}
//     renderItem={storyItem}
//     keyExtractor={(item) => item.url}
  // />

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      // console.log("asd",Buffer.from(result.uri, 'base64'));
      setImage(result.uri);
    }
  }

  const { handleSubmit, register, setValue, errors, reset } = useForm<PostFormData>();
  
  const onSubmit = async (data: PostFormData) => {
    console.log('data', JSON.stringify(data));
    if(!!image){
      console.log("uploading image....", image);
      ipfs.add(image)
      .then(result => {
        console.log("Upload successfull. Sending a request to create a post",result);
        createAPost(data.postContent,data.postUrl, getBytes32FromIpfsHash(result));
      })
      .catch(error => console.error(error));
    }
    else{
      console.log("Sending a request to create a post with no image");
      createAPost(data.postContent,data.postUrl,"0x0000000000000000000000000000000000000000000000000000000000000000");
    }
  };

  console.log("IN rednerr",allPosts);

  return (
    <View style={[StyleSheet.absoluteFill, styles.center, styles.white]}>    
			<Text style={styles.formHeader}>Create a post</Text>
        <Form {...{ register, setValue, validation, errors }}>
          <TextAreaInput name="postContent" label="Content " placeholder="What's on your mind?"/>
          <TextAreaInput name="postUrl" label="Url " placeholder="Attach a url"/>
          <Button ref={register} title="Pick an image from camera roll" onPress={pickImage} />
          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          <Button title="Clear" onPress={() => reset()} />
        </Form>
          <Text>
            Preview:
          </Text>
          {image && <Image ref={register} source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f4f4f4',
        alignItems:'center'
    },
    center: { alignItems: 'center', justifyContent: 'center' },
    // eslint-disable-next-line react-native/no-color-literals
    white: { backgroundColor: 'white' },
		thumbNail: {
			height: 100,
			width: '98%'
		},
		listings: {
			paddingTop: 15,
			paddingBottom: 25,
			borderBottomColor: 'black',
			borderBottomWidth: 1
		},
		title: {
			paddingBottom: 10,
			fontFamily: 'OpenSans',
			fontWeight: 'bold'
		},
		blurb:{
			fontFamily: 'OpenSans',
			fontStyle: 'italic'
		},
    formHeader: {
      fontWeight: 'bold',
      fontSize: 20,
      color: 'black'
    },
    productImage: {
      
    }
});