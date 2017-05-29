import React, { Component } from 'react'
import{
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
    NetInfo
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from './Actions'
import Registration from './registration'

const dismissKeyboard = require('dismissKeyboard');
const background = require("../images/background.jpg");
const lockIcon = require("../images/lock.png");
const personIcon = require("../images/person.png");
const mailIcon = require("../images/mail.png");
const Reachability = require("./Util/Reachability");
const HomeService = require('./Api/HomeService');
const Rx = require('rx');
const ErrorMessages = require("./Util/ErrorMessages");
const ErrorAlert = require("./Util/ErrorAlert");
const Config = require('./config');

const shows_first = [
    {
        key: 1,
        name: 'Colony',
        image: 'http://proto.ink/wp-content/uploads/2016/12/636055955513037869162211565_movie.jpg'
    },
    {
        key: 2,
        name: 'Colony',
        image: 'http://proto.ink/wp-content/uploads/2016/12/636055955513037869162211565_movie.jpg'       
    },
    {
        key: 3,
        name: 'Colony',
        image: 'http://proto.ink/wp-content/uploads/2016/12/636055955513037869162211565_movie.jpg'
    }
]
const shows_second = [
    {
        key: 4,
        name: 'Colony',
        image: 'http://proto.ink/wp-content/uploads/2016/12/636055955513037869162211565_movie.jpg'
    },
    {
        key: 5,
        name: 'Colony',
        image: 'http://proto.ink/wp-content/uploads/2016/12/636055955513037869162211565_movie.jpg'       
    },
    {
        key: 6,
        name: 'Colony',
        image: 'http://proto.ink/wp-content/uploads/2016/12/636055955513037869162211565_movie.jpg'
    }
]

class Home extends Component{
    constructor(props){
        super(props)
        this.state ={
            loading: false,
            email: '',
            password: '',
            userId: '',
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
            .doOnNext(response => {
                var data = []
                response.map((item) =>{
                    data.push(item)
                })
                this.setState({
                    homeData: [data]
                })
            });
        source.subscribe(
            value => console.log(`value ${value}`),
            e => console.log(`error : ${e}`),
            () => console.log(`complete`)
        );
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

    goToSignUp(){
        this.props.navigator.replace({
            title: 'Registration',
            id: 'Registration'
        })
    }

    gotToForgotPassword(){
        this.props.navigator.replace({
            title: 'Forgot Password',
            id: 'ForgotPassword'
        })
    }

    createFlatList(response){
        return response.map((data, i) => {
            return(
                <View key={i}>
                    <View>
                        <Text>{data[i].name}</Text>
                        <FlatList
                            horizontal
                            ItemSeparatorComponent={() => <View style={{width: 5}} />}
                            renderItem={({item}) => this._renderItem(item)}
                            data={data[i].products}
                        />
                    </View>
                </View>
            )
        })
    }

    signIn(){
        Reachability.isNetReachable()
            .map((isReachable) => {
                return {
                    'username': this.state.email,
                    'password': this.state.password
                }
            }, this)
            .flatMap((userCredentials) => {
                return Rx.Observable.fromPromise(LoginService.login({
                    username: userCredentials.username,
                    password: userCredentials.password
                }))
                .timeout(Config.timeoutThreshold, new Error(ErrorMessages.serverError));
            })
            .map((response) => {
                return {
                    tokenType: response.token_type,
                    expiresIn: response.expires_in,
                    accessToken: response.access_token,
                    refreshToken: response.refreshToken
                }
            })
            .subscribe(
            function (response) {
                this.props.navigator.replace({
                    title: 'Home',
                    id: 'Home'
                })
            }.bind(this),
            function (error) {
                ErrorAlert.show(error);
            }.bind(this)
            );
    }

    _renderItem(item){
        return(
            <Image style={{width: 120, height: 180}} source={background} />
        )
    }

    _handleFirstConnectivityChange(isConnected) {
        console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
        NetInfo.isConnected.removeEventListener(
            'change',
            handleFirstConnectivityChange
        );
    }

    render(){
        return(
           <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                {this.createFlatList(this.state.homeData)}
            </View>
           </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
      backgroundColor: '#A6A6A6'
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
  iconWrap:{
      paddingHorizontal: 7,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff"
  },
  icon:{
      width: 20,
      height: 20
  },
  button:{
      backgroundColor: "#ffffff",
      paddingVertical: 15,
      marginVertical: 15,
      alignItems: "center",
      justifyContent: "center"
  },
  buttonText:{
      color:"#0d0d0d",
      fontSize: 18

  },
  signUp: {
      color:"#FFF",
      backgroundColor:"transparent",
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