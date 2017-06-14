import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
} from 'react-native'

const Rx = require('rx');

class Account extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <Text>This is account</Text>
            </View >
        )
    }
}

module.exports = Account;