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
import ImageLoad from 'react-native-image-placeholder';

const Rx = require('rx');
const background = require("../images/background.jpg");
const ProductStore = require('./Store/ProductStore');

class ProductBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                ProductStore.dispatch({
                    productId: this.props.product.id,
                    type: 'UPDATE_SELECTED_PRODUCT'
                });
                this.props.navigator.push({ title: this.props.product.product_name, id: 'ProductDetails'});
            }}>
                <View style={{ width: 120 }}>
                    <ImageLoad
                        style={{ width: 120, height: 180 }}
                        isShowActivity={false}
                        source={{ uri: this.props.product.images[0].image_url }}
                        placeholderSource={background}
                    />
                    <Text style={{ paddingTop: 5 }} numberOfLines={2}>{this.props.product.product_name}</Text>
                </View>
            </TouchableOpacity>
        )

    }
}

module.exports = ProductBox;