import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity
} from 'react-native'

import Swipeout from 'react-native-swipeout'

const Products= require("./Products");
const ProductStore = require('./Store/ProductStore');
const Rx = require('rx');
import PayPal from 'react-native-paypal-wrapper';

class ShoppingCart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalAmount: 0
        }
    }

    componentWillMount(){
        // this._calculateTotalAmount()
        this.props.calculateTotalAmount()
    }

    _calculateTotalAmount(){
        var total = 0
        this.props.products.forEach(function(product) {
            console.log('product price : ', product.price)
            total = parseInt(total) + parseInt(product.price)
            console.log(total)
        }, this);
        this.setState({
            totalAmount : total
        })
    }

    _openPaypal() {
        // 3 env available: NO_NETWORK, SANDBOX, PRODUCTION 
        PayPal.initialize(PayPal.SANDBOX, "ASwEOBo3UxdwSkMrQQM26yVbnqcqqaCruswMEzq8mlmHkK9zbcF2aOtgLz_r_olIUZbftLQ_6Q1LOb1I");
        PayPal.pay({
            price: '40.70',
            currency: 'USD',
            description: 'Your description goes here',
        }).then(confirm => console.log(confirm))
            .catch(error => console.log(error));
    }

    render() {
        return (
             <View style={this.props.outerContainerStyle} >
                <TouchableOpacity onPress={() => this._openPaypal()}>
                    <View>
                        <Text>Press this</Text>
                    </View>
                </TouchableOpacity>
                <View style={this.props.innerContainerStyle}>
                    <Text style={{ color: '#6119BD', fontWeight: '600', fontSize: 14, marginTop: 15, marginLeft: 15 }}>Shopping Cart</Text>
                    <Products products={this.props.products}
                            horizontal={false}
                            navigator={this.props.navigator}
                            productsContainerStyle={styles.productsContainer}
                            productBoxContainerStyle={styles.productBoxContainerStyle} 
                            canDelete={true}
                            deleteFunc={(product) => this.props.deleteFunc(product)}/>
                </View >
                <View>
                    <Text style={{ color: '#6119BD', fontWeight: '600', fontSize: 14, marginTop: 15, marginLeft: 15 }}>Total : {ProductStore.getState().totalAmount}</Text>
                </View>
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