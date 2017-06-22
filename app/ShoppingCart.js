import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
} from 'react-native'

import Swipeout from 'react-native-swipeout'

const Products= require("./Products");
const ProductStore = require('./Store/ProductStore');
const Rx = require('rx');

class ShoppingCart extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount(){
        ProductStore.dispatch({
            isShoppingCart: true,
            type: 'UPDATE_STATE_PAGE'
       })
    }

    render() {
        return (
             <View style={this.props.outerContainerStyle} >
                <View style={this.props.innerContainerStyle}>
                    <Text style={{ color: '#6119BD', fontWeight: '600', fontSize: 14, paddingBottom: 10 }}>Shopping Cart</Text>
                    <Products products={this.props.products}
                            horizontal={false}
                            navigator={this.props.navigator}
                            productsContainerStyle={styles.productsContainer}
                            productBoxContainerStyle={styles.productBoxContainerStyle} />
                </View >
            </View>
        )
    }
}

const styles = StyleSheet.create({
     horizontalOuterContainer: {
        marginLeft: 10,
        marginTop: 10,
        backgroundColor: "#FFFFFF",
        shadowOffset: { width: 5, height: 2, },
        shadowColor: '#888888',
        shadowOpacity: 0.5,
    },
    horizontalInnerContainer: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 20
    },
    verticalOuterContainer: {
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
        backgroundColor: "#FFFFFF",
        shadowOffset: { width: 2, height: 2, },
        shadowColor: '#888888',
        shadowOpacity: 0.5,
    },
    verticalInnerContainer: {
        margin: 10
    },
    productBoxContainer: {
        margin: 10
    },
     productsContainer: {
        margin: 15,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    productBoxContainerStyle: {
        padding: 15
    },
})

module.exports = ShoppingCart;