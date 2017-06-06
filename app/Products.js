import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    FlatList
} from 'react-native'

const Rx = require('rx');
const ProductBox = require("./ProductBox");

class Products extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <FlatList
                    horizontal={this.props.horizontal}
                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                    data={this.props.products}
                    renderItem={({ item }) => <ProductBox product={item} navigator={this.props.navigator} />}
                />
            </View>
        )
    }
}

module.exports = Products;