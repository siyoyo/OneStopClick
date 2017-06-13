import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

const Header = props => {
    return(
        <View style = {styles.container}>
            <TouchableWithoutFeedback onPress={() => props.toggle()}>
                <Icon
                    name = 'bars'
                    color = 'white'
                    size = {25}
                    style = {styles.headerIcon}
                />
            </TouchableWithoutFeedback>
             <TouchableWithoutFeedback 
                onPress={() => props.goToSearch()}>
                <Icon
                    name = 'search'
                    color = 'white'
                    size = {25}
                    style = {styles.headerIcon}
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal : 15,
        backgroundColor: "#350863"
    },
    headerIcon: {
        paddingTop: 12
    }
})


export default Header