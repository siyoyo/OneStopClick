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
                    color = 'black'
                    size = {25}
                />
            </TouchableWithoutFeedback>
             <TouchableWithoutFeedback 
                onPress={() => props.goToSearch()}>
                <Icon
                    name = 'search'
                    color = 'black'
                    size = {25}
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
        marginHorizontal : 15
    }
})


export default Header