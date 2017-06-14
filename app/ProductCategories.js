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
const ProductCategory = require("./ProductCategory");

class ProductCategories extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <FlatList
                    horizontal={false}
                    data={this.props.categories}
                    renderItem={({ item }) => <ProductCategory
                        category={item}
                        horizontal={true}
                        navigator={this.props.navigator}
                        outerContainerStyle={this.props.outerContainerStyle}
                        innerContainerStyle={this.props.innerContainerStyle} />
                    }
                />
            </View>
        )
    }
}

module.exports = ProductCategories;