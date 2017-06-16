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
const ProductStore = require('./Store/ProductStore');
const background = require("../images/background.jpg");
const {width, height} = Dimensions.get('window')
import StarRating from 'react-native-rating-star'
import Icon from 'react-native-vector-icons/FontAwesome'

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
        console.log(rating)
    }

    _renderPrice() {
        if (this.state.product.price == "0.00") {
            return "FREE";
        } else {
            return "IDR" + this.state.product.price;
        }
    }

    render() {
        var price = this._renderPrice();
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
                            <View style={styles.priceRowContainer}>
                                <TouchableOpacity style={styles.buttonTouch}>
                                    <View style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>{price}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonCartTouch}
                                    onPress = {() => {
                                                var shoppingCart = ProductStore.getState().shoppingCartProduct
                                                if(shoppingCart.length < 1 ){
                                                    var shoppingProduct = ProductStore.getState().shoppingCartProduct
                                                    shoppingProduct.push(this.state.product)
                                                    ProductStore.dispatch({
                                                        shoppingCartProduct: shoppingProduct,
                                                        type: 'UPDATE_SHOPPING_CART'
                                                    })
                                                }else{
                                                     var shoppingProduct = []
                                                     if(shoppingCart.shoppingCartProduct.length > 1){
                                                         var shoppingCartSlice = []
                                                        shoppingProduct.push(shoppingCart.shoppingCartProduct, this.state.product)
                                                         shoppingCart.shoppingCartProduct.forEach((product) => {
                                                             shoppingCartSlice.push(product)
                                                         }, this);
                                                         shoppingProduct = shoppingCartSlice.slice()
                                                         shoppingProduct.push(this.state.product)
                                                     }else{
                                                         shoppingProduct.push(shoppingCart, this.state.product)
                                                     }
                                                     ProductStore.dispatch({
                                                        shoppingCartProduct: shoppingProduct,
                                                        type: 'UPDATE_SHOPPING_CART'
                                                    })
                                                }
                                     }}>
                                    <View style={styles.buttonAddToCartContainer}>
                                        <Icon
                                            name='shopping-cart'
                                            color='white'
                                            size={15}
                                            style={styles.iconAddToCart} />
                                        <Text style={styles.buttonText}>Add To Cart</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rateView}>
                        <Text style={styles.rateText}> Rate Now! </Text>
                        <StarRating 
                            maxStars={5}
                            rating={0}
                            selectStar={require('../images/select_star.png')}
                            unSelectStar={require('../images/unselect_star.png')}
                            starSize={50}
                            interitemSpacing={20}
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
        height: 300,
    },
    icon:{
        width: 70,
        height:70,
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 10
    },
    container:{
        flex :1,
        width: width,
        flexDirection : 'column'
    },
    buttonTouch:{
        alignItems: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 10
    },
    buttonCartTouch:{
        alignItems: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingLeft: 0,
        paddingBottom: 10
    },
    buttonContainer:{
        width: 100,
        height: 30,
        backgroundColor: '#6119BD',
        justifyContent:'center',
        alignItems: 'center'
    },
    buttonAddToCartContainer: {
        width: 100,
        height: 30,
        flexDirection: 'row',
        backgroundColor: '#6119BD',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconAddToCart: {
        marginRight: 5
    },
    buttonText:{
        color: 'white',
        fontSize: 12,
    },
    titleText:{
        fontSize: 16,
        fontWeight: '600',
        padding: 10,
        flexWrap: 'wrap',
        width : width - 100
    },
    descriptionText:{
        fontSize: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        marginLeft: 10,
        width: width - 100
    },
    details:{
        alignItems: 'flex-start',
        flexDirection:'row',
        borderBottomWidth:1,
        borderColor: '#F0F0F0'
    },
    detailsText:{
        marginLeft: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        marginRight: 10,
        width :width - 100
    },
    rateText:{
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10
    },
    rateView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceRowContainer: {
        flexDirection: 'row'
    }
})


module.exports = ProductDetails;