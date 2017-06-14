import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
} from 'react-native'

const Rx = require('rx');

class ShoppingCart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <Text>This is shopping cart</Text>
            </View >
        )
    }
}

module.exports = ShoppingCart;