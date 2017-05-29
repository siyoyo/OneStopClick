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
    NetInfo,
    ListView
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
        const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2})
        this.state ={
            loading: false,
            email: '',
            password: '',
            userId: '',
            homeData: ds.cloneWithRows([])
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
            function(value){
                this.setState({
                    homeData: this.state.homeData.cloneWithRows(value)
                })
            }.bind(this),
            e => console.log('error : ${e}'),
            () => console.log('complete')
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

    _renderRow(rowData, sectionId, rowId){
         return(
            <View>
                <Text>{rowData.name}</Text>
                <FlatList
                    horizontal
                    ItemSeparatorComponent={() => <View style={{ width: 5}} />}
                    renderItem={({item}) => <Image style={{ width: 120, height:180}} source={background} />}
                    data= {rowData.products}
                />
            </View>
         )
    }

    render(){
       return(
           <ListView
                dataSource={this.state.homeData}
                renderRow={this._renderRow}
            />
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