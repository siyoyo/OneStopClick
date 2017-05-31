import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Navigator,
    AsyncStorage,
    ActivityIndicator,
    Alert,
    FlatList
} from 'react-native'

const Rx = require('rx');
const background = require("../images/background.jpg");
const ProductBox = require("./ProductBox");

class ProductBoxRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category: this.props.category,
            horizontal: this.props.horizontal
        }
    }

    render() {
        return (
            <View>
                <Text>{this.state.category.name}</Text>
                <FlatList
                    horizontal={this.state.horizontal}
                    ItemSeparatorComponent={() => <View style={{ width: 5}} />}
                    data={this.state.category.products}
                    renderItem={({item}) => <ProductBox product={item} />}
                />
            </View>
        )
    }
}

module.exports = ProductBoxRow;