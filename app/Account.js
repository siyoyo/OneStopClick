import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TextInput,
    ActivityIndicator,
    NetInfo
} from 'react-native'

const Reachability = require("./Util/Reachability");
const UserService = require('./Api/UserService');
const Rx = require('rx');
const ErrorMessages = require("./Util/ErrorMessages");
const ErrorAlert = require("./Util/ErrorAlert");
const Config = require('./config');

class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountData: []
        }
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

    componentWillMount(){
        var source = this._checkConnection()
            .filter(isConnected => isConnected) //only attempt to get home product if connected
            .flatMap(() => {
                return Rx.Observable.fromPromise(UserService.getDetails());
            })

        source.subscribe(
            function (value) {
                this.setState({
                    accountData: value
                })
            }.bind(this),
            e => console.log('error : ${e}'),
            () => console.log('account data : ' , this.state.accountData)
        );
    }

    _renderSeparator() {
        return (
            <View>
                <View style={{ height: 1, backgroundColor: '#F0F0F0' }}>
                </View>
            </View>
        )
    }

    render() {
        return (
             <TouchableWithoutFeedback
                onPress={() => dismissKeyboard()}
                style={{flex: 1}}>
                <View>
                        <View style={styles.container} />
                            <View style={styles.wrapper}>
                                <Text style={styles.rowTitle}>Name</Text>
                                <View style={styles.inputWrap}>
                                    <TextInput
                                        placeholder="Name"
                                        style={styles.input}
                                        underlineColorAndroid="transparent"
                                        value={this.state.accountData.name}
                                    />
                                </View>
                                <Text style={styles.rowTitle}>Email</Text>
                                <View style={styles.inputWrap}>
                                    <TextInput
                                        placeholder="Email"
                                        style={styles.input}
                                        underlineColorAndroid="transparent"
                                        value={this.state.accountData.email}
                                    />
                                </View>
                        </View>
                    <View style={styles.container} />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  background: {
    width: null,
    height: null
  },
  rowContainer:{
      padding : 10,
      justifyContent:'center',
      marginVertical: 10
  },
  rowTitle:{
      fontSize: 16,
      color: "#6119BD"
  }, 
  buttonContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        justifyContent: 'space-between',
        marginVertical: 15
    },
    button:{
        borderRadius: 4,
        backgroundColor: "#9b59b6",
        flex: 1, 
        padding: 10,
        margin: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText:{
        color:"#fff",
        fontSize: 15
    },
    inputWrap:{
      flexDirection: "row",
      marginVertical: 10,
      height: 40,
      backgroundColor:"transparent"
  },
  input:{
      flex : 1,
      paddingHorizontal: 10,
      backgroundColor: "#FFF"
  },
  wrapper:{
      paddingHorizontal: 15
  },
})

module.exports = Account;