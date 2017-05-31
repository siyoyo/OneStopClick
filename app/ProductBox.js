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
import ImageLoad from 'react-native-image-placeholder';

class ProductBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ width: 120 }}>
                <ImageLoad
                    style={{ width: 120, height: 180 }}
                    isShowActivity={false}
                    source={{ uri: this.props.product.images[0].image_url }}
                    placeholderSource={background}
                />
                <Text style={{ paddingTop: 5 }} numberOfLines={2}>{this.props.product.product_name}</Text>
            </View>
        )

    }
}

module.exports = ProductBox;