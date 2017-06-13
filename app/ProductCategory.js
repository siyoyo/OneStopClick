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
            <View style={{ marginLeft: 10, marginTop: 10, backgroundColor: "#FFFFFF"}} >
                <View style={{ margin: 10 }}>
                    <Text style={{ color: '#6119BD', fontWeight: '600', fontSize: 14, paddingBottom: 10 }}>{this.props.category.name}</Text>
                    <Products horizontal={this.props.horizontal} products={this.props.category.products} navigator={this.props.navigator} />
                </View>
                <View style={{ height: 10 }} />
            </View >
        )
    }
}

module.exports = ProductCategory;