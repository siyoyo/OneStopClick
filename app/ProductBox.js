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
    Alert
} from 'react-native'

const Rx = require('rx');
const background = require("../images/background.jpg");

class ProductBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onpress}>
                <Image style={{ width: 120, height: 180 }} source={this.props.background || background} />
            </TouchableOpacity>
        )
    }
}

module.exports = ProductBox;