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
    NetInfo,
    ScrollView,
    FlatList,
    Dimensions
} from 'react-native'

const Rx = require('rx');
const PlainNavigationBar = require('./Components/PlainNavigationBar');
const ProductService = require('./Api/ProductService')
const background = require("../images/background.jpg");
const {width, height} = Dimensions.get('window')
import StarRating from 'react-native-rating-star'

class ProductDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            userRating: 0
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

    _valueChanged(rating){
        this.setState({
            userRating: rating
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <PlainNavigationBar navigator={this.props.navigator} title={this.state.product.product_name} hasRightImage={false} />
                <ScrollView style={styles.container}>
                    <Image source={background} style={styles.thumbnail}/>
                    <View style={styles.details}>
                        <Image source={background} style={styles.icon} />
                        <View style={styles.detailsText}>
                            <Text style={styles.titleText} numberOfLines={2}>{this.state.product.product_name}</Text>
                            <Text style={styles.descriptionText} numberOfLines={0}>{this.state.product.description}</Text>
                            <TouchableOpacity style={styles.buttonTouch}>
                                <View style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>{this.state.product.price}</Text>
                            </View>
                        </TouchableOpacity>
                        </View>
                        <StarRating 
                            maxStars={5}
                            rating={0}
                            selectStar={require('../images/select_star.png')}
                            unSelectStar={require('../images/unselect_star.png')}
                            valueChanged={this._valueChanged}
                            starSize={30}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    thumbnail:{
        width: width,
        height: 300
    },
    icon:{
        width: 70,
        height:70,
        marginTop: 10,
        marginLeft: 10
    },
    container:{
        flex :1
    },
    buttonTouch:{
        alignItems: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginRight: 10
    },
    buttonContainer:{
        width: 80,
        height: 40,
        backgroundColor: '#DEB887',
        justifyContent:'center',
        alignItems: 'center'
    },
    buttonText:{
        color: 'black'
    },
    titleText:{
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    descriptionText:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        padding: 10
    },
    details:{
        alignItems: 'flex-start',
        flexDirection:'row',
        marginRight: 20,
    },
    detailsText:{
        marginLeft: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginRight: 10
    }
})


module.exports = ProductDetails;