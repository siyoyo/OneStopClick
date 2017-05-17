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
    Alert
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

class Login extends Component{
    constructor(props){
        super(props)
        this.state ={
            loading: false,
            email: '',
            password: '',
            userId: ''
        }
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
    }

    render(){
        return(
            <TouchableWithoutFeedback
                onPress={() => dismissKeyboard()}
                style={{flex: 1}}>
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
                                onPress= {this.signIn.bind(this)}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Sign In</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity testID="test-id-buttonSignUp" activeOpacity={.5}
                                onPress={ this.goToSignUp.bind(this) }>
                                <View>
                                    <Text style={styles.signUp}>Do not have an account, Sign Up!</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity testID="test-id-buttonForgot" activeOpacity={.5}
                                onPress={ this.gotToForgotPassword.bind(this) }>
                                <View>
                                    <Text style={styles.signUp}>Forgot Password?</Text>
                                </View>
                            </TouchableOpacity>
                            <ActivityIndicator
                                animating = {this.state.loading}
                                color='#111'
                                size = 'large'></ActivityIndicator>
                        </View>
                    <View style={styles.container} />
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
      width: null,
      height: null
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)