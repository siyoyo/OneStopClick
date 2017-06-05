import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TextInput,
    Dimensions,
    FlatList,
    ScrollView,
    Image,
    NetInfo
} from 'react-native'

const {width, height} = Dimensions.get('window')
const background = require("../../images/background.jpg");
const SearchService = require('../Api/SearchService');
const Rx = require('rx');
import Icon from 'react-native-vector-icons/FontAwesome'

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            text: '',
            data: '',
            searchData: []
        }
    }

    static navigationOptions ={
        headerVisible: false
    }

    _checkConnection(){
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

    filter(text){
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );

        var source = this._checkConnection() 
            .filter(isConnected => isConnected) //only attempt to get home product if connected
            .flatMap(() => {
                return Rx.Observable.fromPromise(SearchService.searchProduct());
            })

        source.subscribe(
            function(value){
                this.setState({
                    searchData: value
                })
            }.bind(this),
            e => console.log('error : ${e}'),
            () => console.log('complete')
        );
    }

    _renderItem(item){
        const{navigate} = this.props.navigation
        return(
            <TouchableWithoutFeedback onPress={() => navigate('Details', {item:item})}>
                <Image style={{width:120, height:180}} source={background} />
            </TouchableWithoutFeedback>
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <View style ={ styles.header}>
                    <Icon
                        name= 'search'
                        color='black'
                        size = {18}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        value={this.state.text}
                        onChangeText={(text) => this.filter(text)}
                        style={styles.input}
                        placeholder='Search'
                        placeholderTextColor='grey'
                        keyboardAppearance='dark'
                        autoFocus={true}
                    />
                    {this.state.text ?
                    <TouchableWithoutFeedback 
                        onPress={() => this.deleteData()}>
                        <Icon
                            name='times-circle'
                            color='black'
                            size={18}
                            style={styles.iconInputClose}
                        />
                    </TouchableWithoutFeedback>
                    : null }
                    <TouchableWithoutFeedback style={styles.cancelButton}
                        onPress={() => this.props.navigator.pop()}>
                        <View style={styles.containerButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView>
                    <FlatList
                        style={{marginHorizontal: 5}}
                        data={this.state.data}
                        numColumns={3}
                        columnWrapperStyle={{marginTop: 5, marginLeft: 5}}
                        renderItem={({item}) => this._renderItem(item)}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#181818'
    },
    header: {
        height: 40,
        // backgroundColor: '#181818',
        borderBottomWidth: 1,
        borderColor: '#3a3a3a',
        paddingBottom: 5,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    searchIcon: {
        position: 'absolute',
        top: 5,
        left: 15,
        zIndex: 1,
        backgroundColor:'transparent'
    },
    iconInputClose: {
        position: 'absolute',
        top: 5,
        right: 90,
        backgroundColor: 'transparent',
        zIndex: 1
    },
    input: {
        width: width - (width / 4),
        height: 30,
        backgroundColor: '#d3d3d3',
        marginHorizontal: 10,
        paddingLeft: 30,
        borderRadius: 3,
        color: 'grey'
    },
    containerButton:{
        width: 60,
        height: 30,
        backgroundColor:'#d3d3d3'
    },
    cancelButtonText: {
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        marginRight: 5,
        width: 115,
        height: 170
    }
})

export default Search