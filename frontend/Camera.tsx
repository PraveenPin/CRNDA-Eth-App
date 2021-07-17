import React from 'react';
import { StyleSheet, Text, Platform, View, TouchableOpacity, Image, Button, Linking, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons  } from '@expo/vector-icons';

export default class CameraComponent extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.camera = React.createRef();
        this.state = {
            hasPermission: null,
            cameraType: Camera.Constants.Type.back,
            openCamera: false
        }
    }
      
    async componentDidMount() {
        this.getPermissionAsync();
    } 

    showCamera = () => {
        this.setState({ openCamera: true });
    }

    closeCamera = () => {
        this.setState({ openCamera: false });
    }

    getPermissionAsync = async () => {
        // Camera roll Permission 
        if (Platform.OS === 'ios') {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
        // Camera Permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasPermission: status === 'granted' });
      }

    handleCameraType=()=>{
        const { cameraType } = this.state;
    
        this.setState({cameraType:
          cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
        })
    }

    takePicture = async () => {
        if (this.camera) {
          let photo = await this.camera.takePictureAsync({
            quality: 1,
            base64: true,
            exif: true
          });
          this.props.setImage(photo);
        }
        // this.closeCamera();
    }
    
    pickAImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
          });
          this.props.pickImage(result);
          this.closeCamera();
    }

    render(){
            if (this.state.hasPermission === null) {
            return <View />;
            } else if (this.state.hasPermission === false && !this.state.openCamera) {
            return (<View>                        
                        <Button title="Camera" onPress={this.getPermissionAsync} />
                    </View>);
            } else if (this.state.hasPermission === true && !this.state.openCamera) {
                return (<View>                        
                            <Button title="Open Camera" onPress={this.showCamera} />
                        </View>);
            } else {
            return(
                <View style={[StyleSheet.absoluteFill]}>                
                    <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={ref => {this.camera = ref}}>
                    <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:20}}>
                        <TouchableOpacity
                            style={{
                            top: '10',
                            left: '10',
                            backgroundColor: 'transparent',
                            }}
                            onPress={() => this.closeCamera()}>
                            <MaterialCommunityIcons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'transparent',                  
                            }}
                            onPress={() => this.pickAImage()}
                        >
                            <MaterialIcons name="photo-library" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            }}
                            onPress={() => this.takePicture()}>
                            <FontAwesome
                                name="camera"
                                style={{ color: "#fff", fontSize: 40}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            }}                    
                            onPress={()=>this.handleCameraType()}
                            >
                            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    </Camera>
                </View>
            );
        }
    }
}