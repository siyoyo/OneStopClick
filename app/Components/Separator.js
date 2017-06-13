import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
} from 'react-native'

class Separator extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={[styles.container, this.props.separatorStyle]}>
            </View>
        )
    }
}


var styles = StyleSheet.create({
    container: {
        height: 1
    }
});

module.exports = Separator;