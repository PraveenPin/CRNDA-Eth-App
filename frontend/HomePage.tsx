import React from 'react';
import { StyleSheet, Text, Platform, View, ActivityIndicator, Image, Button, Linking, Alert } from 'react-native';
import TextAreaInput from './components/TextAreaInput';
import Form from './components/Form';
import validation from './utils/validation';
import { PostFormData } from './DataTypes';
import { useForm } from 'react-hook-form';
import ipfs, { getBytes32FromIpfsHash } from './utils/ipfs';
import * as ImagePicker from 'expo-image-picker';
import CameraComponent from './Camera';
// import { Buffer } from "buffer";

export default function HomePage({ route, navigation, userAddress, contract }): JSX.Element{

  const [image, setImage] = React.useState(undefined);
  const [imageBlob, setImageBlob] = React.useState(undefined);

  React.useEffect(() => {    
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  
  });

  const createAPost = React.useCallback( async (content : string, url : string, imageHash : string ) => {
      const TRANSFER_GAS_ESTIMATION = await contract.methods.createPost(content, url, imageHash).estimateGas({ from : userAddress });
      // const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas for creating this post",TRANSFER_GAS_ESTIMATION, content, url, imageHash);
      await contract.methods.createPost(content, url, imageHash).send({ from: userAddress, gas: TRANSFER_GAS_ESTIMATION })
      .once('receipt', (receipt) => {
          console.log("receipt",receipt);
      });
  },[]);


  const takeImage = async (image) => {
    console.log("enter dragon",image);
    const ans = base64ToUint8Array(image.base64);
    console.log("URL 222222222 after",Buffer(ans));
    setImageBlob(Buffer(ans));
    setImage(image.uri);
  }

  const pickImageDirectly = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
    console.log("URL 333333333333333333", result);

    const ans = base64ToUint8Array(result.base64);
    console.log("URL 33333333333333 after",Buffer(ans));
    setImageBlob(Buffer(ans));
    setImage(result.uri);
  }

  const pickImage = async (result) => {
    console.log("URL 1111111111111", result);
    const ans = base64ToUint8Array(result.base64);
    console.log("URL 1111111111111 after",Buffer(ans));
    setImageBlob(Buffer(ans));
    setImage(result.uri);

    // if (!result.cancelled) {
    //   fetch(result.uri)
    //   .then(res => res.blob())
    //   .then(blob => {
    //     console.log("blob",blob);
    //     const reader = new FileReader();
    //     reader.readAsArrayBuffer(blob);
    //     reader.onloadend = () => {
    //       setImageBlob(Buffer(reader.result));
    //     }
    //   })
    //   setImage(result.uri);
    // }
  }

  const { handleSubmit, register, setValue, errors, reset } = useForm<PostFormData>();
  
  const onSubmit = async (data: PostFormData) => {
    console.log('data', JSON.stringify(data));
    if(!!imageBlob && !!image){
      console.log("uploading image....", imageBlob);
      ipfs.add(imageBlob)
      .then(result => {
        console.log("Upload successfull. Sending a request to create a post",result);
        createAPost(data.postContent,data.postUrl, getBytes32FromIpfsHash(result[0].path));
      })
      .catch(error => console.error(error));
    }
    else{
      console.log("Sending a request to create a post with no image");
      createAPost(data.postContent,data.postUrl,"0x0000000000000000000000000000000000000000000000000000000000000000");
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.white]}>    
			  <Text style={styles.formHeader}>Create a post</Text>
        <Form {...{ register, setValue, validation, errors }}>
          <TextAreaInput name="postContent" label="Content " placeholder="What's on your mind?"/>
          <TextAreaInput name="postUrl" label="Url " placeholder="Attach a url"/>
          <Button ref={register} title="Pick an image from camera roll" onPress={pickImageDirectly} />
          <CameraComponent ref={register} setImage={takeImage} pickImage={pickImage}/>
          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          <Button title="Clear" onPress={() => reset()} />
        </Form>
          <Text>
            Image Preview:
          </Text>
          {image && <Image ref={register} source={{uri: image}} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f4f4f4',
        alignItems:'center'
    },
    // center: { alignItems: 'center', justifyContent: 'center' },
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

function base64ToUint8Array (string) {
  var str = string.replace(/^data:image\/[a-z]+;base64,/, "");
  console.log("aaaaaaaaaaaaaa", string, str);
  var raw = atob(str);
  var rawLength = raw.length;
  const buffer = new ArrayBuffer(rawLength);
  var array = new Uint8Array(buffer);
  // for (var i = 0; i < rawLength; i += 1) {
  //   array[i] = raw.charCodeAt(i);
  // }
  array.set(Array.from(raw).map(c => c.charCodeAt(0)));
  return array;
}

// from: https://stackoverflow.com/questions/42829838/react-native-atob-btoa-not-working-without-remote-js-debugging
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const atob = (input = '') => {
	let str = input.replace(/=+$/, '');
	let output = '';

	if (str.length % 4 == 1) {
		throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
	}
	for (let bc = 0, bs = 0, buffer, i = 0;
		buffer = str.charAt(i++);

		~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
			bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
	) {
		buffer = chars.indexOf(buffer);
	}

	return output;
}