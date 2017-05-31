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
        this.state = {
            product: this.props.product
        }
    }

    _isImageExist(imageUrl) {
        var http = new XMLHttpRequest();

        http.open('HEAD', imageUrl, false);
        http.send();

        return http.status != 404;
    }

    render() {
        // var imageSource = this._isImageExist(this.state.product.images[0].image_url) ? this._isImageExist(this.state.product.images[0].image_url) : 'background';
        return (
            <TouchableOpacity>
                <Image style={{ width: 120, height: 180 }} source={background} />
            </TouchableOpacity>
        )
    }
}

module.exports = ProductBox;