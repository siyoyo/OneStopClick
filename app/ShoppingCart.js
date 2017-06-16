import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
} from 'react-native'

const Products= require("./Products");
const ProductStore = require('./Store/ProductStore');
const Rx = require('rx');

class ShoppingCart extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount(){
        console.log(ProductStore.getState().shoppingCartProduct)
    }

    render() {
        return (
            <View>
                <Products products={ProductStore.getState().shoppingCartProduct}
                        horizontal={false}
                        navigator={this.props.navigator}
                        productsContainerStyle={styles.productsContainer}
                        productBoxContainerStyle={styles.productBoxContainerStyle} />
            </View >
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
    }
})

module.exports = ShoppingCart;