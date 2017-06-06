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
    NetInfo
} from 'react-native'

const Rx = require('rx');
const PlainNavigationBar = require('./Components/PlainNavigationBar');
const ProductService = require('./Api/ProductService')

class ProductDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
        }
    }

    componentWillMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );

        this._getProductDetails();
    }


    _handleFirstConnectivityChange(isConnected) {
        console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
        NetInfo.isConnected.removeEventListener(
            'change',
            handleFirstConnectivityChange
        );
    }

    _checkConnection() {
        return Rx.Observable.create(observer => {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    observer.next(isConnected);
                    observer.onCompleted();
                }
                else {
                    observer.error("no internet connection")
                }
            });
        });
    }


    _getProductDetails() {
        var source = this._checkConnection()
            .filter(isConnected => isConnected) //only attempt to get home product if connected
            .flatMap(() => {
                return Rx.Observable.fromPromise(ProductService.getDetails());
            })
            .map(response => response.data)

        source.subscribe(
            function (value) {
                this.setState({
                    product: value
                })
            }.bind(this),
            e => console.log(`error : ${e}`),
            () => console.log('complete')
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <PlainNavigationBar navigator={this.props.navigator} title={this.state.product.product_name} hasRightImage={false} />
            </View>
        )
    }
}

module.exports = ProductDetails;