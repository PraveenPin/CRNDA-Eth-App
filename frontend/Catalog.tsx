import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import globalCatalog from './CatalogDB';
import { navigationRef } from './RootNavigation';

export default class Catalog extends React.Component<any,{catalogData: any }>{
    constructor(props){
        super(props);
        this.state={
            catalogData: globalCatalog  
        }
    }

    setCatalogData = (data) => {
        this.setState({ catalogData: data });
    }

    render(){
        const catalogItem = ({item}) => {
            return(
                <TouchableWithoutFeedback
                    onPress={ () => this.props.navigation.navigate('PostDetail', { id: item.modelNumber})}
                >
                    <View style={styles.products}>
                        <View style={styles.productImage}>
                            <Image
                                style={styles.thumbNail}
                                source={item.image}
                            />
                        </View>
                        <View style={styles.productText}>
                            <Text style={styles.title}>{item.model}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.catalogData}
                    renderItem={catalogItem}
                    keyExtractor={(item) => item.modelNumber}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        paddingTop: 25
    },
    products: {
        flexDirection: 'row',
        padding: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        fontSize: 26,
        justifyContent: 'center'
    },
    productImage: {
        flex: 1
    },
    thumbNail: {
        height: 260,
        width: '100%'
    },
    productText:{
        alignItems: 'flex-start',
        paddingLeft:15,
        flex: 1
    },
    title:{
        fontWeight: 'bold',
        paddingBottom: 10,
        fontFamily: 'OpenSans'
    },
    description:{
        textAlign: 'left',
        fontSize: 12,
        fontFamily: 'OpenSans'
    }
});