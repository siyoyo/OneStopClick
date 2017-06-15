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
    NetInfo
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from './Actions'
import Registration from './registration'
import FBSDK  from 'react-native-fbsdk'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'

const{
    LoginButton,
    AccessToken
} = FBSDK
const dismissKeyboard = require('dismissKeyboard');
const background = require("../images/background.jpg");
const lockIcon = require("../images/lock.png");
const personIcon = require("../images/person.png");
const mailIcon = require("../images/mail.png");
const Reachability = require("./Util/Reachability");
const LoginService = require('./Api/LoginService');
const Rx = require('rx');
const ErrorMessages = require("./Util/ErrorMessages");
const ErrorAlert = require("./Util/ErrorAlert");
const Config = require('./config');
const AccountAction = require('./Actions/account');
const AccountReducer = require('./Reducers/account');
const UserStore = require('./Store/UserStore');

class Login extends Component{
    constructor(props){
        super(props)
        this.state ={
            loading: false,
            email: 'ryan.adhitya@mitrais.com',
            password: 'mitrais',
            userId: '',
            accessToken: '',
            user: ''
        }
    }

    componentWillMount(){
        this._componentWillUnmountStream = new Rx.Subject();
        this._loginBtnPressStream = new Rx.Subject();

        this._loginBtnPressStream
            .takeUntil(this._componentWillUnmountStream)
            .filter(() => {
                console.log("login button pressed");
                return !this.state.loading; // only continue if not searching yet
            })
            .flatMap(() => {
                console.log("checking connection for login");
                return this._checkConnection();
            })
            .filter(isConnected => isConnected)
            .doOnNext(() => {
                this.setState({ loading: true });
            })
            .flatMap(() => {
                console.log("trying to login");
                return Rx.Observable.fromPromise(LoginService.login({
                    username: this.state.email,
                    password: this.state.password
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
            (value) => this._onLoginSuccess(value),
            (error) => this._onLoginFail(error),
            () => this._onLoginComplete());
    }

    componentDidMount(){
        NetInfo.isConnected.addEventListener(
            'change',
            this._handleFirstConnectivityChange
        );

        this._setupGoogleSignin()
    }

    componentWillUnmount() {
        this._componentWillUnmountStream.onNext(null);
        this._componentWillUnmountStream.onCompleted();
    }

    _handleFirstConnectivityChange(isConnected) {
        console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
        NetInfo.isConnected.removeEventListener(
            'change',
            this._handleFirstConnectivityChange
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

    _onLoginSuccess(value) {
        UserStore.dispatch({
            accessToken: value.accessToken,
            type: 'UPDATE_ACCESS_TOKEN'
        });

        UserStore.dispatch({
            username: this.state.email,
            type: 'LOGIN'
        });

        this.props.navigator.replace({
            title: 'Home',
            id: 'Home'
        })
    }

    _onLoginFail(error) {
        ErrorAlert.show(error);
    }

    _onLoginComplete() {
        console.log('_loginBtnPressStream complete')
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
                UserStore.dispatch({
                    accessToken: response.accessToken,
                    type: 'UPDATE_ACCESS_TOKEN'
                });

                UserStore.dispatch({
                    username: this.state.email,
                    type: 'LOGIN'
                });

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

    async _setupGoogleSignin(){
        try {
            await GoogleSignin.hasPlayServices({autoResolve: true})
            await GoogleSignin.configure({
                iosClientId:'com.googleusercontent.apps.64926634916-vst43n1gvuulj73nld1ggfqi7f5al49s',
                offlineAccess: false
            })

            const user = await GoogleSignin.currentUserAsync()
            this.setState({user})
        } catch (error) {
            console.log('Google signIn error', err.code, err.message)
        }
    }

    signInGoogle(){
        GoogleSignin.hasPlayServices({ autoResolve: true}).then(() => {
            this.setState({user})
        })
        .catch((err) => {
            console.log("Play services error", err.code, err.message)
        })
    }

    _renderLoginBtn(){
        if(this.state.loading){
            return (
                <View style={[styles.button, styles.loadingButton]}>
                    <Text style={styles.buttonText}>Logging In</Text>
                    <ActivityIndicator style={styles.ActivityIndicator} />
                </View> 
            );
        } else {
            return (
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </View> 
            );
        }
    }

    render(){
        var loginButton = this._renderLoginBtn();
        return(
            <TouchableWithoutFeedback
                onPress={() => dismissKeyboard()}
                style={{flex: 1}}>
                <View style={[styles.background,styles.container]} >
                        <View style={styles.container} />
                            <View style={styles.wrapper}>
                                <View style={styles.inputWrap}>
                                    <View style={styles.iconWrap}>
                                        <Image
                                            source={personIcon}
                                            style = {styles.icon}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <TextInput
                                        testID="test-id-textfield-email"
                                        placeholder="Email"
                                        style={styles.input}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(email) => this.setState({email})}
                                        value={this.state.email}
                                    />
                                </View>
                                <View style={styles.inputWrap}>
                                    <View style={styles.iconWrap}>
                                        <Image
                                            source={lockIcon}
                                            style = {styles.icon}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <TextInput
                                        testID="test-id-textfield-password"
                                        placeholder="Password"
                                        secureTextEntry
                                        style={styles.input}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(password) => this.setState({password})}
                                        value={this.state.password}
                                    />
                                </View>
                                <TouchableOpacity activeOpacity={.5}
                                    testID="test-id-buttonSignIn"
                                    onPress= {() => this._loginBtnPressStream.onNext(null)}>
                                    {loginButton}
                                </TouchableOpacity>
                                <Text style={styles.orText}>Or</Text>
                                <View style={styles.facebookLoginContainer}>
                                    <LoginButton
                                        publishPermissions={["publish_actions"]}
                                        onLoginFinished={
                                            (error, result) => {
                                                if (error) {
                                                    alert("login has error : " + result.error)
                                                } else if (result.isCancelled) {
                                                    alert("login is cancelled")
                                                } else {
                                                    AccessToken.getCurrentAccessToken().then(
                                                        (data) => {
                                                            alert(data.accessToken.toString())
                                                        }
                                                    )
                                                }
                                            }
                                        }
                                        onLogoutFinished={() => alert('logout')}
                                    />
                                </View>
                                <GoogleSigninButton 
                                    style={{width: 212, height: 48}}
                                    size={GoogleSigninButton.Size.Standard}
                                    color={GoogleSigninButton.Color.Auto}
                                    onPress={this.signInGoogle.bind(this)}
                                />
                                <TouchableOpacity testID="test-id-buttonSignUp" activeOpacity={.5}
                                    onPress={ this.goToSignUp.bind(this) }>
                                    <View>
                                        <Text style={styles.signUp}>Do not have an account, Create One!</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity testID="test-id-buttonForgot" activeOpacity={.5}
                                    onPress={ this.gotToForgotPassword.bind(this) }>
                                    <View>
                                        <Text style={styles.signUp}>Forgot Password?</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        <View style={styles.container} />
                    </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
      backgroundColor: '#6119BD'
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
  loadingButton: {
      opacity: 0.5,
      flexDirection: 'row'
  },
  ActivityIndicator: {
    marginLeft: 20
  },
  buttonText:{
      color:"#0d0d0d",
      fontSize: 18

  },
  signUp: {
      color:"#FFF",
      backgroundColor:"transparent",
      textAlign: "center"
  },
  orText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20
  },
  facebookLoginContainer: {
      alignItems: 'center',
      marginBottom: 20
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch)
}

function mapStateToProps(state) {
    return {
        userId: state.userId,
        email: state.email,
        displayName: state.displayName,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)