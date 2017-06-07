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

    _renderSeparator() {
        if (this.props.horizontal === true) {
            return <View style={{ width: 15 }} />
        }
        else {
            return (
                <View>
                    <View style={{ height: 1, backgroundColor: '#F0F0F0' }}>
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={this.props.containerStyle}>
                <FlatList
                    horizontal={this.props.horizontal}
                    ItemSeparatorComponent={() => this._renderSeparator()}
                    data={this.props.products}
                    numColumns={this.props.numColumns}
                    renderItem={({ item }) => <ProductBox product={item}
                        horizontal={this.props.horizontal}
                        navigator={this.props.navigator}
                        productBoxContainerStyle={this.props.productBoxContainerStyle} />}
                />
            </View>
        )
    }
}

module.exports = Products;