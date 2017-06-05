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
const PlainNavigationBar = require('./Components/PlainNavigationBar');

class ProductDetails extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <PlainNavigationBar navigator={this.props.navigator} hasRightImage={false}/>
                <Text>Detailss</Text>
            </View>
        )
    }
}

module.exports = ProductDetails;