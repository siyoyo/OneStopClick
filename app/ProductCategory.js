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
    FlatList
} from 'react-native'

const Rx = require('rx');
const background = require("../images/background.jpg");
const ProductBox = require("./ProductBox");

class ProductBoxRow extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{ marginLeft: 10, marginTop: 10, backgroundColor: "#FFFFFF"}} >
                <View style={{ margin: 10 }}>
                    <Text style={{ fontWeight: 'bold', paddingBottom: 5 }}>{this.props.category.name}</Text>
                    <FlatList
                        horizontal={this.props.horizontal}
                        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                        data={this.props.category.products}
                        renderItem={({ item }) => <ProductBox product={item} />}
                    />
                </View>
                <View style={{ height: 10 }} />
            </View >
        )
    }
}

module.exports = ProductBoxRow;