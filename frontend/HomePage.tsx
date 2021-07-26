import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image, Button, Linking, Alert } from 'react-native';
import TextAreaInput from './components/TextAreaInput';
import Form from './components/Form';
import validation from './utils/validation';
import { PostFormData } from './DataTypes';
import { useForm, Controller } from 'react-hook-form';
import ipfs, { getBytes32FromIpfsHash } from './utils/ipfs';
import * as ImagePicker from 'expo-image-picker';
import {
  PacmanIndicator
} from 'react-native-indicators';
// import { Buffer } from 'buffer';
import PhotoLibIcon from '../assets/image/photolibrary.png';
import CameraIcon from '../assets/image/camera.png';
import PostIcon from '../assets/image/upload.png';
import ClearIcon from '../assets/image/clear.png';

export default function HomePage({ route, navigation, userAddress, contract }): JSX.Element{

  const [image, setImage] = React.useState(undefined);
  const [imageFile, setImageFile] = React.useState(undefined);
  const [hasCameraRollPermission, setCameraRollPermission] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const createAPost = React.useCallback( async (content : string, url : string, imageHash : string ) => {
      const TRANSFER_GAS_ESTIMATION = await contract.methods.createPost(content, url, imageHash).estimateGas({ from : userAddress });
      // const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas for creating this post",TRANSFER_GAS_ESTIMATION, content, url, imageHash);
      await contract.methods.createPost(content, url, imageHash).send({ from: userAddress, gas: TRANSFER_GAS_ESTIMATION })
      .once('receipt', (receipt) => {
          console.log("receipt",receipt);
          setImage('');
          setImageFile('');
          setLoading(false);
      });
  },[]);


  const takePicture = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    console.log("permissionResult",permissionResult);

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    if (!image.cancelled) {
      imageConverstionToUpload(image);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    if (!result.cancelled) {
      await imageConverstionToUpload(result);
    }
  }

  const imageConverstionToUpload = async (image) => {

    fetch(image.uri).then(res => res.blob()).then(blob => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = () => {
        setImageFile(Buffer(reader.result));
      }
    });
    setImage(image.uri);
  }

  const { handleSubmit, register, setValue, errors, reset } = useForm<PostFormData>();
  
  const onSubmit = async (data: PostFormData) => {
    setLoading(true);
    console.log('data', JSON.stringify(data));
    if(!!imageFile && !!image){
      console.log("uploading image....", imageFile);
      ipfs.add(imageFile)
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

  if(!!isLoading){
    return <PacmanIndicator color="black"/>
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.white, styles.padding]}>    
        <Form {...{ register, setValue, validation, errors, reset }}>
          <TextAreaInput name="postContent" label="Content " placeholder="What's on your mind?"/>
          <TextAreaInput name="postUrl" label="Url " placeholder="Attach a url"/>
          <Text style={styles.sideText}>Attach a photo: </Text>
           <View style={styles.attachContainer}>             
            <TouchableOpacity 
              style={styles.iconText}
              onPress={pickImage} 
            >
              <Text style={styles.textInTouch}>Camera roll</Text>
              <Image source={PhotoLibIcon} style={styles.iconStyle}/>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconText}
              onPress={takePicture} 
            >
              <Text style={styles.textInTouch}>Camera</Text>
              <Image source={CameraIcon} style={styles.iconStyle}/>
            </TouchableOpacity>
           </View>
           <View style={styles.attachContainer}>             
            <TouchableOpacity 
              style={styles.iconText}
              onPress={handleSubmit(onSubmit)} 
            >
              <Text style={styles.textInTouch}>Upload Post</Text>
              <Image source={PostIcon} style={styles.iconStyle}/>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconText}
              onPress={takePicture} 
            >
              <Text style={[styles.textInTouch, { color: 'red'}]}>Clear Form</Text>
              <Image source={ClearIcon} style={styles.iconStyle}/>
            </TouchableOpacity>
           </View>
          {/* <Button title="Pick from Camera roll" onPress={pickImage} />
          <Button title="Camera" onPress={takePicture} /> */}
          {/* <Button title="Post" onPress={handleSubmit(onSubmit)} /> */}
          {/* <Button color="red" title="Clear" onPress={() => reset()} /> */}
        </Form>
        <View style={{ padding: 4 }}>          
          <Text style={styles.sideText}>
            Image Preview:
          </Text>
          {image && <Image ref={register} source={{uri: image}} style={{ width: 140, height: 140 }} />}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({    
    white: { backgroundColor: '#fafafa' },
    padding: { padding: 4 },
    iconStyle: { width: 36, height: 36 },
    attachContainer: { 
      display: 'flex',
      justifyContent: 'center', 
      flexDirection: 'row', 
      alignItems: 'center', 
      width: '100%',
      padding: 4
    },
    iconText: {
      display: 'flex',
      flexDirection: 'row', 
      justifyContent: 'space-evenly', 
      height: 50, 
      alignItems: 'center',
      // backgroundColor: 'red',
      width: '48%',
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 1,
      margin: 4
    },
    textInTouch:{
      fontSize: 18,
      color: '#007AFF'
    },
    sideText: {      
      paddingVertical: 5,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#292928',
    },
    actionButton:{
      width: '60%',
    }
}); 