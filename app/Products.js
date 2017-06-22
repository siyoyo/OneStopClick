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

    render() {
        var swipeBtns = [
            {
                text: 'Delete',
                backgroundColor: 'red',
                underlayColor:'rgba(0,0,0,1,0.6)'
            }
        ]
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
                            underlayColor='rgba(192,192,192,1,0.6)'
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
    }
}

module.exports = Products;