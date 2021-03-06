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
    Picker,
    ActivityIndicator
} from 'react-native'

const { width, height } = Dimensions.get('window')
const background = require("../../images/background.jpg");
const SearchService = require('../Api/SearchService');
const Rx = require('rx');
import Icon from 'react-native-vector-icons/FontAwesome'
import ReactNativePicker from 'react-native-picker'
const Products = require('../Products');
const ProductStore = require('../Store/ProductStore');
const DismissKeyboard = require('dismissKeyboard');

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoryId: '',
            searchText: '',
            data: '',
            searchData: [],
            categoryData: [],
            isCatPickerShow: false,
            isSearching: false
        }
    }

    static navigationOptions = {
        headerVisible: false
    }

    componentWillMount() {
        this._componentWillUnmountStream = new Rx.Subject();
        this._searchBtnPressStream = new Rx.Subject();

        this._searchBtnPressStream
            .takeUntil(this._componentWillUnmountStream)
            .filter(() => {
                console.log("search button pressed");
                return !this.state.isSearching; // only continue if not searching yet
            })
            .flatMap(() => {
                console.log("checking connection for search");
                return this._checkConnection();
            })
            .filter(isConnected => isConnected)
            .doOnNext(() => {
                DismissKeyboard();
                this.setState({ isSearching: true });
            })
            .flatMap(() => {
                return Rx.Observable.fromPromise(SearchService.searchProduct(this.state.categoryId, this.state.searchText));
            })
            .subscribe(
            (value) => this._onSearchSuccess(value),
            (error) => this._onSearchFail(error),
            () => this._onComplete());
    }

    componentDidMount() {
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
            function (value) {
                this.setState({
                    categoryData: value
                })
            }.bind(this),
            e => console.log('error : ${e}'),
            () => console.log(this.state.categoryData)
        );
    }

    _onSearchSuccess(value) {
        console.log(`search success with data: ${value}`);
        this.setState({
            searchData: value,
            isSearching: false
        });
    }

    _onSearchFail(error) {
        console.log(`error : ${error}`)
    }

    _onComplete() {
        console.log('stream complete')
    }

    componentWillUnmount() {
        this._componentWillUnmountStream.onNext(null);
        this._componentWillUnmountStream.onCompleted();
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

    _pickerDataText(categoryData) {
        var categoryDataText = []
        for (var index = 0; index < categoryData.length; index++) {
            var element = categoryData[index]
            categoryDataText.push(element.text)
        }
        return categoryDataText
    }

    _pickerDataId(category) {
        for (var index = 0; index < this.state.categoryData.data.length; index++) {
            var categoryText = this.state.categoryData.data[index].text
            var categoryTextId = this.state.categoryData.data[index].id

            if (category === categoryText) {
                this.setState({
                    categoryId: categoryTextId
                })
            }
        }
    }

    showCategory() {
        console.log(this.state.categoryData.data)
        console.log(this._pickerDataText(this.state.categoryData.data))
        ReactNativePicker.init({
            pickerData: this._pickerDataText(this.state.categoryData.data),
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

    setCatPickerShow(isDisplayed) {
        this.setState({
            isCatPickerShow: isDisplayed
        })
    }

    _renderResultText(){
        if(this.state.searchData.length > 0){
            return (
                <Text style={styles.resultText}>Found {this.state.searchData.length} result:</Text>
            );
        }
        else {
            return (
                <Text style={styles.resultText}>No Result Found</Text>
            );
        }
    }

    _renderProduct() {
        if (this.state.isSearching) {
            return <ActivityIndicator style={[styles.centering]} />
        }
        else if (this.state.searchData.length > 0) {
            var resultText = this._renderResultText();
            return (
                <View>
                    {resultText}
                    <Products products={this.state.searchData}
                        horizontal={false}
                        navigator={this.props.navigator}
                        productsContainerStyle={styles.productsContainer}
                        productBoxContainerStyle={styles.productBoxContainerStyle}
                        canDelete={false} />
                </View>
            );
        }
        else
        {
            return null
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.showCategory.bind(this)}>
                        <TextInput
                            value={this.state.category}
                            style={styles.categoryInput}
                            placeholder='Choose Category'
                            placeholderTextColor='grey'
                            editable={false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} style={styles.cancelButton}
                        onPress={() => this.props.navigator.pop()}>
                        <View style={styles.containerButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.headerSearch}>
                    <TextInput
                        value={this.state.searchText}
                        onChangeText={(searchText) => this.setState({ searchText })}
                        style={styles.input}
                        placeholder='Search Text (name or desc)'
                        placeholderTextColor='grey'
                        editable={true}
                    />
                    <TouchableWithoutFeedback style={styles.cancelButton}
                        onPress={() => this._searchBtnPressStream.onNext(null)}>
                        <View style={styles.containerSubmitButton}>
                            <Text style={styles.cancelButtonText}>Search</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView style={styles.scrollView}>
                    {this._renderProduct()}
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
        backgroundColor: '#6119BD',
        borderColor: '#3a3a3a',
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    headerSearch: {
        height: 40,
        backgroundColor: '#6119BD',
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
        backgroundColor: 'transparent'
    },
    iconInputClose: {
        position: 'absolute',
        top: 5,
        right: 90,
        backgroundColor: 'transparent',
        zIndex: 1
    },
    categoryInput: {
        width: width - (width / 4),
        height: 30,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 10,
        paddingLeft: 15,
        marginTop: 20,
        fontSize: 14
    },
    input: {
        width: width - (width / 4),
        height: 30,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        paddingLeft: 15,
        fontSize: 14
    },
    containerButton: {
        width: 60,
        height: 30,
        marginTop: 20,
        backgroundColor: '#fefeff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerSubmitButton: {
        width: 60,
        height: 30,
        backgroundColor: '#fefeff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelButtonText: {
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14
    },
    image: {
        marginRight: 5,
        width: 115,
        height: 170
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    scrollView: {
        backgroundColor: '#ffffff',
    },
    productsContainer: {
        margin: 15,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    productBoxContainerStyle: {
        padding: 15
    },
    resultText: {
        marginTop: 15,
        marginLeft: 15
    }
})

export default Search