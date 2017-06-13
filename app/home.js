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
    FlatList,
    NetInfo,
    ListView
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from './Actions'
import Registration from './registration'
import Header from './Components/header'
import SideMenu from 'react-native-side-menu'
import Menu from './Components/menu'

const dismissKeyboard = require('dismissKeyboard');
const lockIcon = require("../images/lock.png");
const personIcon = require("../images/person.png");
const mailIcon = require("../images/mail.png");
const Reachability = require("./Util/Reachability");
const HomeService = require('./Api/HomeService');
const Rx = require('rx');
const ErrorMessages = require("./Util/ErrorMessages");
const ErrorAlert = require("./Util/ErrorAlert");
const Config = require('./config');
const ProductCategories = require('./ProductCategories');

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            email: '',
            password: '',
            userId: '',
            isOpen: false,
            homeData: []
        }
    }

    componentWillMount() {
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );

        this._getHomeProducts();
    }

    _getHomeProducts() {
        var source = this._checkConnection()
            .filter(isConnected => isConnected) //only attempt to get home product if connected
            .flatMap(() => {
                return Rx.Observable.fromPromise(HomeService.getIndex());
            })

        source.subscribe(
            function (value) {
                this.setState({
                    homeData: value
                })
            }.bind(this),
            e => console.log('error : ${e}'),
            () => console.log('complete')
        );
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

    _handleFirstConnectivityChange(isConnected) {
        console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
        NetInfo.isConnected.removeEventListener(
            'change',
            handleFirstConnectivityChange
        );
    }

    _renderItem(item) {
        return (
            <ProductBox />
        )
    }

    goToSearch() {
        this.props.navigator.push({
            title: 'Search',
            id: 'Search'
        })
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    updateMenu(isOpen) {
        this.setState({ isOpen })
    }

    render() {
        return (

            <SideMenu
                menu={<Menu />}
                isOpen={this.state.isOpen}
                onChange={(isOpen) => this.updateMenu(isOpen)}
            >
                <View style={styles.container}>
                    <Header
                        toggle={this.toggle.bind(this)}
                        goToSearch={this.goToSearch.bind(this)}
                    />
                    <ProductCategories categories={this.state.homeData} navigator={this.props.navigator}/>
                </View>
            </SideMenu>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
        paddingBottom: 20
    },
    background: {
        backgroundColor: '#A6A6A6'
    },
    inputWrap: {
        flexDirection: "row",
        marginVertical: 10,
        height: 40,
        backgroundColor: "transparent"
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: "#FFF"
    },
    wrapper: {
        paddingHorizontal: 15
    },
    iconWrap: {
        paddingHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff"
    },
    icon: {
        width: 20,
        height: 20
    },
    button: {
        backgroundColor: "#ffffff",
        paddingVertical: 15,
        marginVertical: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "#0d0d0d",
        fontSize: 18

    },
    signUp: {
        color: "#FFF",
        backgroundColor: "transparent",
        textAlign: "center"
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch)
}

function mapStateToProps(state) {
    console.log(state.userId)
    return {
        userId: state.userId,
        email: state.email,
        displayName: state.displayName
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)