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
const BackArrow = require('../../images/arrow_left_black.png');
import Icon from 'react-native-vector-icons/FontAwesome'

class PlainNavigationBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => { this.props.navigator.pop() }}
                    style={styles.navIconLeft}
                >
                    <Icon
                        name = 'arrow-left'
                        color = 'black'
                        size = {25}
                    />
                </TouchableOpacity>
                <Text>
                    {this.props.title}
                </Text>
                {this.props.hasRightImage ?
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this.props.rightImagePress}
                        style={styles.touchableArea}
                    >
                        <Image
                            source={this.props.rightImageSource}
                            style={styles.navIcon}
                        />
                    </TouchableOpacity>
                    : <View style={{ width:25, paddingRight: 15}}></View>
                }
            </View>
        )
    }
}


var styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#DEB887",
        paddingTop: 10
    },
    navIconLeft: {
        paddingLeft: 15
    }
});

module.exports = PlainNavigationBar;