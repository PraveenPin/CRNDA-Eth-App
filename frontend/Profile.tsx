import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfilePage({ route }): JSX.Element{
     
    const [name, nameChange] = useState('');
    const [email, emailChange] = useState('');
    const [phone, phoneChange] = useState('');
    const [message, messageChange] = useState('');
    const [submitError, setError] = useState(false);
    const [submitted, trySubmit] = useState(false);

    const { model, modelNumber } = route.params;

    useEffect( () => {
        if(model !== 'Footer'){
            const newProfile = `${model} model#: ${modelNumber}`;
            messageChange(newProfile);
        }
        else{
            
        }
    }, []);

    const postMessage = () => {
        if( !name || !email || !message){
            setError(true);
        }
        else{
            setError(false);
            trySubmit(true);
        }
    }
    return(
        <View style={styles.container}>
            <ScrollView>
                {submitError ? 
                    <Text style={styles.status}>
                        You didn't enter a Name, Email or Message
                    </Text>  :
                    <Text style={styles.status}>
                        Please enter the requested information
                    </Text>
                }
                {submitted ? 
                    <Text>
                        Name : {name} Email : {email}
                    </Text> :
                    <Text style={styles.req}>* required</Text>
                }

                <Text style={styles.label}>Name *</Text>
                <TextInput style={styles.input}
                    onChangeText={ text => nameChange(text)}
                    value={name}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input}
                    onChangeText={ text => phoneChange(text)}
                    value={phone}
                />

                <Text style={styles.label}>Message *</Text>
                <TextInput style={styles.input}
                    onChangeText={ text => messageChange(text)}
                    value={message}
                    multiline
                    numberOfLines={5}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => postMessage()}
                >
                    <Text>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor:  '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    input: {
        height: 40,
        width: 250,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 26,
        fontFamily: 'OpenSans',
    },
    label: {
        fontFamily: 'OpenSans',
        fontSize: 18,
        paddingTop: 20
    },
    req: {
        paddingTop: 10,
        fontStyle: 'italic',
        fontFamily: 'OpenSans'
    },
    mutli:{
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 16,
        fontFamily: 'OpenSans',
        width: 300
    },
    button:{
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingTop: 10
    },
    status:{
        paddingTop: 10,
        paddingBottom: 15
    }
});