import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native'
import Swipeout from 'react-native-swipeout'

const Rx = require('rx');
const ProductBox = require("./ProductBox");
const ProductStore = require('./Store/ProductStore');

class Products extends Component {
    constructor(props) {
        super(props)
    }

    _renderSeparator() {
        if (this.props.horizontal === true) {
            return <View style={{ width: 15 }} />
        }
        else {
            return (
                <View>
                    <View style={{ height: 1, backgroundColor: '#F0F0F0' }}>
                    </View>
                </View>
            )
        }
    }

    _deleteData(item){
        alert('Deleted')
        // var shoppingCartData = ProductStore.getState().shoppingCartProduct
        // console.log(shoppingCartData)
        // console.log(this.props.product)
        // var index = shoppingCartData.indexOf(this.props.product.id)
        // shoppingCartData.splice(index, 1)
        // console.log(shoppingCartData)
        // ProductStore.dispatch({
        //     shoppingCartProduct: shoppingCartData,
        //     type: 'UPDATE_SHOPPING_CART'
        // })
    }

    render() {
        var swipeBtns = [
            {
                text: 'Delete',
                backgroundColor: 'red',
                underlayColor:'rgba(0,0,0,1)',
                onPress:(item) => {this._deleteData(item)}
            }
        ]
        var isShoppingCart = ProductStore.getState().isShoppingCart
        console.log(isShoppingCart)
        if (isShoppingCart === true) {
            return (
                <View style={this.props.productsContainerStyle}
                >
                        <FlatList
                            horizontal={this.props.horizontal}
                            ItemSeparatorComponent={() => this._renderSeparator()}
                            data={this.props.products}
                            numColumns={this.props.numColumns}
                            renderItem={({ item }) => 
                            <Swipeout right={swipeBtns}
                                autoclose='true'
                                backgroundColor='transparent'
                            >
                            <TouchableWithoutFeedback
                                underlayColor='rgba(192,192,192,1.0)'
                                onPress={() => console.log('test delete')}
                            >
                                <ProductBox product={item}
                                    horizontal={this.props.horizontal}
                                    navigator={this.props.navigator}
                                    productBoxContainerStyle={this.props.productBoxContainerStyle} />
                            </TouchableWithoutFeedback>
                            </Swipeout>}
                        />
                </View>
            )
        }else{
            return (
                <View style={this.props.productsContainerStyle}
                >
                        <FlatList
                            horizontal={this.props.horizontal}
                            ItemSeparatorComponent={() => this._renderSeparator()}
                            data={this.props.products}
                            numColumns={this.props.numColumns}
                            renderItem={({ item }) => 
                                <ProductBox product={item}
                                    horizontal={this.props.horizontal}
                                    navigator={this.props.navigator}
                                    productBoxContainerStyle={this.props.productBoxContainerStyle} />
                            }
                        />
                </View>
            )
        }
    }
}

module.exports = Products;