import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableOpacity,
    Image
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

    _renderTotal() {
        if (this.props.products.length > 0) {
            return (
                <Text style={{ color: '#6119BD', fontWeight: '600', fontSize: 14, marginTop: 15, marginLeft: 15 }}>Total : {ProductStore.getState().totalAmount}</Text>
            );
        }
        else {
            return (
                <Text style={{ fontSize: 14, marginTop: 15, marginLeft: 15 }}>You dont have anything in the cart</Text>
            );
        }
    }

    _openPaypal() {
        var totalPriceString = ProductStore.getState().totalAmount.toString();
        console.log(`total amount: ${totalPriceString}`);
        // 3 env available: NO_NETWORK, SANDBOX, PRODUCTION 
        PayPal.initialize(PayPal.SANDBOX, "ASwEOBo3UxdwSkMrQQM26yVbnqcqqaCruswMEzq8mlmHkK9zbcF2aOtgLz_r_olIUZbftLQ_6Q1LOb1I");
        PayPal.pay({
            price: totalPriceString,
            currency: 'USD',
            description: 'Buy please ^_^',
        }).then(confirm => alert(JSON.stringify(confirm, null, 4)))
            .catch(error => alert(JSON.stringify(error, null, 4)));
    }

    _renderPaypal() {
        if (ProductStore.getState().totalAmount > 0) {
            return (
                <TouchableOpacity onPress={() => this._openPaypal()}>
                    <Image
                        style={{ width: 173, height: 34, marginLeft: 15, marginTop: 15 }}
                        source={{ uri: 'https://www.paypalobjects.com/webstatic/en_US/i/btn/png/gold-pill-paypalcheckout-34px.png' }}
                    />
                </TouchableOpacity>
            );
        }
    }

    render() {
        var paypal = this._renderPaypal();
        var total = this._renderTotal();
        return (
            <View style={this.props.outerContainerStyle} >
                <View style={this.props.innerContainerStyle}>
                    <Text style={{ color: '#6119BD', fontWeight: '600', fontSize: 14, marginTop: 15, marginLeft: 15 }}>Shopping Cart</Text>
                    <Products products={this.props.products}
                        horizontal={false}
                        navigator={this.props.navigator}
                        productsContainerStyle={styles.productsContainer}
                        productBoxContainerStyle={styles.productBoxContainerStyle}
                        canDelete={true}
                        deleteFunc={(product) => this.props.deleteFunc(product)} />
                </View >
                {total}
                {paypal}
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