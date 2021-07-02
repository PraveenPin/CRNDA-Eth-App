import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';

export default function NewsDetails({ route, navigation }): JSX.Element{
    const [dataLoading, finishLoading] = useState(true);
    const [allPostData, setAllPostData] = useState([]);
    console.log("route", route);
    const { url } = route.params;
    const selectedPost = allPostData.find(post => post.url === url);

    useEffect( () => {
        fetch('https://newsapi.org/v2/everything?q=tech&apiKey=10b25f941dd343278d9ae7cef2f45cd5')
        .then((response) =>  response.json())
        .then((json) => setAllPostData(json.articles))
        .catch(error => console.log(error))
        .finally(() =>  finishLoading(false));
      }, [setAllPostData, finishLoading]);

      return (
          <View style={styles.container}>
              <TouchableOpacity
                style={styles.button}
                onPress={ () => navigation.goBack()}
              >
                  <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
              {dataLoading ? <ActivityIndicator/> : (
                  <ScrollView>
                      <Text style={styles.title}>{selectedPost.title}</Text>
                      <Image
                        style={styles.storyImage}
                        source={{ uri: selectedPost.urlToImage }}
                      ></Image>
                      <Text style={styles.blurb}>{selectedPost.description}</Text>
                      <Text style={styles.content}>{selectedPost.content}</Text>
                  </ScrollView>
              )}
          </View>
      );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems:'center'
    },
    center: { alignItems: 'center', justifyContent: 'center' },
    // eslint-disable-next-line react-native/no-color-literals
    white: { backgroundColor: 'white' },
    storyImage: {
        height: 300,
        width: '100%'
    },
    title: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 20
    },
    button: {
        padding: 20,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    blurb:{
        fontFamily: 'OpenSans',
        fontStyle: 'italic',
        fontSize: 20,
        padding: 20
    },
    content:{
        flex: 1,
        fontFamily: 'OpenSans',
        fontStyle: 'italic',
        fontSize: 16,
        padding: 20
    },
    buttonText:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
    }
});