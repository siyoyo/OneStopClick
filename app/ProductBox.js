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
const Dimensions = require('Dimensions').get('window');

class ProductBox extends Component {
    constructor(props) {
        super(props)
    }

    _renderProduct() {
        if (this.props.horizontal === true) {
            return (
                <View style={{ width: 72 }}>
                    <ImageLoad
                        style={{ width: 72, height: 72, borderRadius: 10 }}
                        isShowActivity={false}
                        source={{ uri: this.props.product.images[0].image_url }}
                        placeholderSource={background}
                    />
                    <Text style={{ paddingTop: 5, fontSize: 12 }} numberOfLines={2}>{this.props.product.product_name}</Text>
                </View>
            );
        } else {
            return (
                <View style={[{ flexDirection: 'row', justifyContent: 'flex-start' }, this.props.productBoxContainerStyle]}>
                    <ImageLoad
                        style={{ width: 72, height: 72 }}
                        isShowActivity={false}
                        source={{ uri: this.props.product.images[0].image_url }}
                        placeholderSource={background}
                    />
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 15, width: Dimensions.width - 75 - 72 }}>
                        <Text style={{ flex: 1, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{this.props.product.product_name}</Text>
                        <Text style={{ flex: 1, fontSize: 12 }} numberOfLines={2}>{this.props.product.description}</Text>
                        <Text style={{ flex: 2, alignSelf: 'flex-end', color: '#DEB887', fontSize: 12 }}>{this._renderPrice()}</Text>
                    </View>
                </View>
            );
        }
    }

    _renderPrice(){
        if (this.props.product.price == "0.00"){
            return "FREE";
        } else
        {
            return "IDR" + this.props.product.price;
        }
    }

    render() {
        var product = this._renderProduct();
        return (
            <TouchableOpacity onPress={() => {
                ProductStore.dispatch({
                    productId: this.props.product.id,
                    type: 'UPDATE_SELECTED_PRODUCT'
                });

                this.props.navigator.push({ 
                    title: this.props.product.product_name, 
                    id: 'ProductDetails',
                    price: this.props.product.price,
                    description: this.props.product.description,
                    urlDownload: this.props.product.urldownload,
                    category: this.props.name
                });
            }}>
                {product}
            </TouchableOpacity>
        )

    }
}

module.exports = ProductBox;