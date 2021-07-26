import React, {useEffect, useState} from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity , View, Image, ScrollView, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Identicon from 'identicon.js';

export default function Comment({ postComments, addComment, navigation, postData }): JSX.Element{

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
                    <View style={styles.userInfo}>                        
                        <Text>{item.authorId}</Text>
                        <Image style={{ width: 30, height: 30 }}
                            source={{ uri: `data:image/png;base64,${new Identicon(item.author, 30).toString()}`}}
                        />
                    </View>
                    <Text style={styles.commentText}>{item.comment}</Text>
                </View>
            </TouchableWithoutFeedback>
        );

    };

    return(
        <View style={{ marginBottom: 12 }}>
            <Text style={styles.header}>Comments</Text>
            <ScrollView style={{ marginTop: 8 }}>
                <FlatList
                    data={postComments}
                    renderItem={commentItem}
                    keyExtractor={(item) => item.cid}
                />                
            </ScrollView>
            <View style={styles.commentContainer}>                
                <TextInput
                    style={styles.addInput}
                    value={newComment}                    
                    onChangeText={ val => setNewComment(val)}
                    placeholder="Want to add a comment..."
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={addNewComment}
                >
                    <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commentContainer:{
        width: '100%',
        padding: 6,
        display: 'flex',
        justifyContent:'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 32,
        backgroundColor: '#fafafa',
        borderColor: '#c2bebe'
    },
    header: {
        fontFamily: 'OpenSans',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    userInfo: {
        alignItems: 'center',
        width: '15%',
        borderRightWidth: 1,
        borderRightColor: 'grey'
    },
    commentText: {
        width: '85%',
        paddingLeft: 8
    },
    addInput:{
        height: 45,
        width: '85%',
        paddingLeft: 8,
        borderRightWidth: 1,
        borderColor: 'grey'
    },
    addButton:{
        width: '15%',
        alignItems: 'center'
    },
    addText:{
        fontSize: 18,
        color: '#007AFF'
    }
});