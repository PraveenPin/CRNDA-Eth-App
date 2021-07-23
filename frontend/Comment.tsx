import React, {useEffect, useState} from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity , View, Image, ScrollView, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Identicon from 'identicon.js';

export default function Comment({ postComments, addComment, navigation, postData, closeCommentsBox }): JSX.Element{

    const [newComment, setNewComment] = useState('');

    const addNewComment = () => {
        console.log("new comment", newComment, newComment.length);
        if(newComment.length > 0){
            addComment(postData.pid, newComment);
            setNewComment('');
        }
    }

    const commentItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback                
                onPress={() => navigation.navigate('UserPosts', {
                    userId: item.authorId
                })}
            >
                <View style={styles.commentContainer}>
                    <Image style={{ width: 30, height: 30 }}
                        source={{ uri: `data:image/png;base64,${new Identicon(item.author, 30).toString()}`}}
                    />
                    <Text>{item.authorId}</Text>
                    <Text style={styles.commentText}>{item.comment}</Text>
                </View>
            </TouchableWithoutFeedback>
        );

    };

    return(
        <View>            
            <ScrollView>
                <FlatList
                    data={postComments}
                    renderItem={commentItem}
                    keyExtractor={(item) => item.cid}
                />                
            </ScrollView>
            <TouchableOpacity
                onPress={closeCommentsBox}
            >
                <Text>Close Comments</Text>
            </TouchableOpacity>
            <TextInput
                    value={newComment}                    
                    onChangeText={ val => setNewComment(val)}
                    placeholder="Want to add a comment..."
            />
            <TouchableOpacity
                onPress={addNewComment}
            >
                <Text>Add</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    commentContainer:{
        width: '100%',
        paddingTop: 25
    },
    commentText: {

    }
});