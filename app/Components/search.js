import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    Dimensions,
    FlatList,
    ScrollView,
    Image,
    NetInfo,
    Picker
} from 'react-native'

const {width, height} = Dimensions.get('window')
const background = require("../../images/background.jpg");
const SearchService = require('../Api/SearchService');
const Rx = require('rx');
import Icon from 'react-native-vector-icons/FontAwesome'
import ReactNativePicker from 'react-native-picker'
const Products = require('../Products');

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            categoryId: '',
            searchText:'',
            data: '',
            searchData: [],
            categoryData:[],
            isCatPickerShow: false
        }
    }

    static navigationOptions ={
        headerVisible: false
    }

    componentDidMount(){
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );

        var source = this._checkConnection() 
            .filter(isConnected => isConnected) //only attempt to get home product if connected
            .flatMap(() => {
                return Rx.Observable.fromPromise(SearchService.getCategory());
            })

        source.subscribe(
            function(value){
                this.setState({
                    categoryData: value
                })
            }.bind(this),
            e => console.log('error : ${e}'),
            () => console.log(this.state.categoryData)
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

    _search() {

        var source = this._checkConnection()
            .filter(isConnected => isConnected)
            .flatMap(() => {
                return Rx.Observable.fromPromise(SearchService.searchProduct(this.state.categoryId, this.state.searchText));
            })

        source.subscribe(
            function (value) {
                this.setState({
                    searchData: value
                })
            }.bind(this),
            e => console.log(`error : ${e}`),
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

    _pickerDataText(categoryData){
        var categoryDataText = []
        for (var index = 0; index < categoryData.length; index++) {
            var element = categoryData[index]
            categoryDataText.push(element.text)
        }
        return categoryDataText
    }

    _pickerDataId(category){
        for (var index = 0; index < this.state.categoryData.data.length; index++) {
            var categoryText = this.state.categoryData.data[index].text
            var categoryTextId = this.state.categoryData.data[index].id

            if (category === categoryText){
                this.setState({
                    categoryId : categoryTextId
                })
            }
        }
    }

    showCategory(){
        console.log(this.state.categoryData.data)
        console.log(this._pickerDataText(this.state.categoryData.data))
        ReactNativePicker.init({
            pickerData: this._pickerDataText(this.state.categoryData.data),
            selectedValue: [this.state.category],
            onPickerConfirm: pickedValue => {
                if (pickedValue[0] !== '') {
                    this.setState({
                        category: pickedValue[0]
                    })
                    this._pickerDataId(this.state.category)
                }
            },
            onPickerCancel: pickedValue => {
                console.log('category cancel ', pickedValue)
            },
            onPickerSelect: pickedValue => {
                console.log('category select ', pickedValue)
            }
        })
        ReactNativePicker.show();
        this.setCatPickerShow(true)
    }

    setCatPickerShow(isDisplayed){
        this.setState({
            isCatPickerShow : isDisplayed
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <View style ={ styles.header}>
                    <TouchableOpacity onPress={this.showCategory.bind(this)}>
                        <TextInput
                            value={this.state.category}
                            style={styles.categoryInput}
                            placeholder='Category'
                            placeholderTextColor='grey'
                            editable={false}
                        />
                    </TouchableOpacity>
                    <TouchableWithoutFeedback style={styles.cancelButton}
                        onPress={() => this.props.navigator.pop()}>
                        <View style={styles.containerButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.headerSearch}>
                    <TextInput
                        value={this.state.searchText}
                        onChangeText={(searchText) => this.setState({searchText})}
                        style={styles.input}
                        placeholder='Search'
                        placeholderTextColor='grey'
                        editable={true}
                    />
                    <TouchableWithoutFeedback style={styles.cancelButton}
                        onPress={() => this._search()}>
                        <View style={styles.containerSubmitButton}>
                            <Text style={styles.cancelButtonText}>Search</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView>
                    <Products products={this.state.searchData} horizontal={true} navigator={this.props.navigator}/>
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
        height: 60,
        backgroundColor: '#DEB887',
        borderColor: '#3a3a3a',
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    headerSearch:{
        height: 60,
        backgroundColor: '#DEB887',
        borderColor: '#3a3a3a',
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
    },
    searchIcon: {
        position: 'absolute',
        top: 25,
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
    categoryInput:{
        width: width - (width / 4),
        height: 30,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 10,
        paddingLeft: 30,
        marginTop:20,
        borderRadius: 3,
    },
    input: {
        width: width - (width / 4),
        height: 30,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        marginHorizontal: 10,
        paddingLeft: 30,
    },
    containerButton:{
        width: 50,
        height: 30,
        marginTop:15,
        backgroundColor:'#f0f0f0',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius:3,
        borderTopLeftRadius:3,
        borderTopRightRadius:5,
        justifyContent: 'center',
        alignItems: 'center'
    },
     containerSubmitButton:{
        width: 50,
        height: 30,
        backgroundColor:'#f0f0f0',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius:3,
        borderTopLeftRadius:3,
        borderTopRightRadius:5,
        justifyContent: 'center',
        alignItems: 'center'
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