import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native'
import Swipeout from 'react-native-swipeout'

const Rx = require('rx');
const ProductBox = require("./ProductBox");
const ProductStore = require('./Store/ProductStore');

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

    _renderDeleteButton(item) {
        return [
            {
                text: 'Delete',
                backgroundColor: 'red',
                underlayColor: 'rgba(0,0,0,1)',
                onPress: () => { this.props.deleteFunc(item) }
            }
        ]
    }

    render() {
        if (this.props.canDelete === true) {
            return (
                <View style={this.props.productsContainerStyle}
                >
                    <FlatList
                        horizontal={this.props.horizontal}
                        ItemSeparatorComponent={() => this._renderSeparator()}
                        data={this.props.products}
                        numColumns={this.props.numColumns}
                        renderItem={({ item }) =>
                            <Swipeout right={this._renderDeleteButton(item)}
                                autoclose='true'
                                backgroundColor='transparent'
                            >
                                <ProductBox product={item}
                                    horizontal={this.props.horizontal}
                                    navigator={this.props.navigator}
                                    productBoxContainerStyle={this.props.productBoxContainerStyle} />
                            </Swipeout>}
                    />
                </View>
            )
        } else {
            return (
                <View style={this.props.productsContainerStyle}
                >
                    <FlatList
                        horizontal={this.props.horizontal}
                        ItemSeparatorComponent={() => this._renderSeparator()}
                        data={this.props.products}
                        numColumns={this.props.numColumns}
                        renderItem={({ item }) =>
                            <ProductBox product={item}
                                horizontal={this.props.horizontal}
                                navigator={this.props.navigator}
                                productBoxContainerStyle={this.props.productBoxContainerStyle} />
                        }
                    />
                </View>
            )
        }
    }
}

module.exports = Products;