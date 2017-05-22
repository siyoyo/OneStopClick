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
    Alert,
    ActivityIndicator
} from 'react-native'

const dismissKeyboard = require('dismissKeyboard');
const background = require("../images/background.jpg");
const lockIcon = require("../images/lock.png");
const personIcon = require("../images/person.png");
const mailIcon = require("../images/mail.png");

export default class Registration extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            name: '',
            email: '',
            password:'',
            confirmPassword: ''
        }
    }
    updateDisplayName(name){
        var user = Firebase.auth().currentUser
        console.log(user)
         user.updateProfile({
            displayName: name
                    }).then(function() {
                        console.log(name)
                }, function(error) {
                    alert(error.message)
                });
    }
    validateForm() {
        if(this.state.name === '' || this.state.email === '' || this.state.password === '' || this.state.confirmPassword === '') {
            alert('Please fill all fields.')
            return false
        } else {
            return true
        }
    }
    validatePassword(password, confirmPassword) {
        if(password !== confirmPassword) {
            alert('Passwords invalid, confirm password is not equal.')
            return false
        } else {
            return true
        }
    }
    signUp(){
        if(!this.validateForm() || !this.validatePassword(this.state.password, this.state.confirmPassword)) {
            return
        }
        this.setState({
            loading: true
        })

        Firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
            .then((userData) => {
            AsyncStorage.setItem('userData', JSON.stringify(userData));
            console.log("before update name")
            console.log(userData.displayName)
            Alert.alert('Registration','User has been created',[{text:'OK', onPress: () =>
                userData.updateProfile({
                    displayName: this.state.name
                }).then(() => {
                    console.log(this.state.name)
                    this.setState({
                        name: '',
                        email:'',
                        password:'',
                        confirmPassword:'',
                        loading: false
                    })
                    this.props.navigator.replace({
                    title: 'Login',
                    id: 'Login',
                })
                }, function(error) {
                    alert(error.message)
                })
            }])
            console.log("after update name")
            })
            .catch((error) => {
                //Handle Errors
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/weak-password'){
                    Alert.alert('Registration','The password is too weak',[{text:'OK', onPress: () => 
                        this.setState({
                            loading: false
                        })
                }])
                }else{
                    Alert.alert('Registration',error.message,[{text:'OK', onPress: () =>
                        this.setState({
                            loading: false
                        })
                    }])
                }
            })
    }

    goToSignIn(){
        this.props.navigator.replace({
            title: 'Login',
            id: 'Login'
        })
    }
    render(){
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
                                    placeholder="Name"
                                    style={styles.input}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(name) => this.setState({name})}
                                    value={this.state.name}
                                />
                            </View>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Image
                                        source={mailIcon}
                                        style = {styles.icon}
                                        resizeMode="contain"
                                    />
                                </View>
                                <TextInput
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
                                    placeholder="Password"
                                    secureTextEntry
                                    style={styles.input}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(password) => this.setState({password})}
                                    value={this.state.password}
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
                                    placeholder="Confirm Password"
                                    secureTextEntry
                                    style={styles.input}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                                    value={this.state.confirmPassword}
                                />
                            </View>
                            <TouchableOpacity activeOpacity={.5}
                                onPress={this.signUp.bind(this)}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Register</Text>
                                </View>
                            </TouchableOpacity>
                            <ActivityIndicator
                                animating = {this.state.loading}
                                color='#111'
                                size = 'large'></ActivityIndicator>
                            <TouchableOpacity activeOpacity={.5}
                                onPress={this.goToSignIn.bind(this)}>
                                <View>
                                    <Text style={styles.loginText}>Already has an account, Login</Text>
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
    flex: 1,
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
  loginText: {
      color:"#FFF",
      backgroundColor:"transparent",
      textAlign: "center"
  }
});