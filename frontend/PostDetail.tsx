import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import globalCatalog from './CatalogDB';

export default function PostDetail({ route, navigation }){
    const [catalogData, setCatalogData] = useState(globalCatalog);
    const { id } = route.params;
    const selectedProduct = catalogData.find(post => post.modelNumber === id);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            <ScrollView>
                <Text style={styles.buttonText}>Go Back</Text>
                <Image 
                    style={styles.productImage}
                    source={selectedProduct.image}
                />
                <Text style={styles.description}>{selectedProduct.description}</Text>
            </ScrollView>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Profile', {
                    model: selectedProduct.model,
                    modelNumber: selectedProduct.modelNumber
                })}
            >
                <Text style={styles.buttonText}>Submit Post</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        marginBottom: 100
    },
    button: {
        padding: 20,
    },
    buttonText:{
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
    },
    model: {
        fontFamily: 'OpenSans',
        paddingBottom: 15
    },
    productImage: {
        height: 250,
        width: '100%'
    },
    description: {
        paddingTop: 10
    }
});