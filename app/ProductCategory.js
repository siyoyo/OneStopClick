import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
} from 'react-native'

const Rx = require('rx');
const Products = require("./Products");

class ProductCategory extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={this.props.outerContainerStyle} >
                <View style={this.props.innerContainerStyle}>
                    <Text style={{ color: '#6119BD', fontWeight: '600', fontSize: 14, paddingBottom: 10 }}>{this.props.category.name}</Text>
                    <Products 
                    horizontal={this.props.horizontal} 
                    products={this.props.category.products} 
                    navigator={this.props.navigator}
                    productsContainerStyle={this.props.productsContainerStyle}
                    productBoxContainerStyle={this.props.productBoxContainerStyle}
                    canDelete={false} />
                </View>
            </View >
        )
    }
}

module.exports = ProductCategory;
