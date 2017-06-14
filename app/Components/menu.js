const React = require('react');
const {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  NetInfo,
  FlatList
} = require('react-native');
const { Component } = React;

import Icon from 'react-native-vector-icons/FontAwesome'

const Rx = require('rx');
const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
const UserStore = require('../Store/UserStore');
const Separator = require('./Separator');
const CategoryService = require('../Api/CategoryService');

module.exports = class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: UserStore.getState().user.username,
      categoryData: []
    }
  }

  componentWillMount() {
    NetInfo.addEventListener(
      'change',
      this._handleConnectionInfoChange
    );

    this._getCategories();
  }

  _handleConnectionInfoChange(isConnected) {
    console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
    NetInfo.isConnected.removeEventListener(
      'change',
      _handleConnectionInfoChange
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

  _getCategories() {
    var source = this._checkConnection()
      .filter(isConnected => isConnected) //only attempt to get home product if connected
      .flatMap(() => {
        console.log('start get categories');
        return Rx.Observable.fromPromise(CategoryService.getIndex());
      })

    source.subscribe(
      function (response) {
        this.setState({
          categoryData: response.data
        })
      }.bind(this),
      e => console.log('error : ${e}'),
      () => console.log('complete')
    );
  }

  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri, }} />
          <Text style={[styles.text, styles.avatarName]} numberOfLines={1} >{this.state.username}</Text>
        </View>
        <Separator separatorStyle={styles.separatorStyle} />
        <TouchableOpacity onPress={() => this.props.onPressNavMenu(1)}>
          <View style={styles.optionContainer}>
            <Icon
              name='home'
              color='white'
              size={20}
              style={styles.optionIcon}
            />
            <Text style={[styles.text, styles.optionText]}>Home</Text>
          </View>
        </TouchableOpacity>
        <Separator separatorStyle={styles.separatorStyle} />
        <TouchableOpacity onPress={() => this.props.onPressNavMenu(2)}>
          <View style={styles.optionContainer}>
            <Icon
              name='shopping-cart'
              color='white'
              size={20}
              style={styles.optionIcon}
            />
            <Text style={[styles.text, styles.optionText]}>Shopping Cart</Text>
          </View>
        </TouchableOpacity>
        <Separator separatorStyle={styles.separatorStyle} />
        <View style={styles.categoryContainer}>
          <View style={styles.optionContainer}>
            <Icon
              name='list-ol'
              color='white'
              size={20}
              style={styles.optionIcon}
            />
            <Text style={[styles.text, styles.optionText]}>Category</Text>
          </View>
          <FlatList
            style={styles.flatListStyle}
            ItemSeparatorComponent={() => <Separator separatorStyle={styles.separatorStyle} />}
            horizontal={false}
            data={this.state.categoryData}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => this.props.onPressNavMenu(3, item.id)}>
                <View style={[styles.categoryOptionContainer]}>
                  <Text style={[styles.text]}>{item.text}</Text>
                </View>
              </TouchableOpacity>}
          />
        </View>
        <Separator separatorStyle={styles.separatorStyle} />
        <TouchableOpacity onPress={() => this.props.onPressNavMenu(4)}>
          <View style={styles.optionContainer}>
            <Icon
              name='user-o'
              color='white'
              size={20}
              style={styles.optionIcon}
            />
            <Text style={[styles.text, styles.optionText]}>Account</Text>
          </View>
        </TouchableOpacity>
        <Separator separatorStyle={styles.separatorStyle} />
        <TouchableOpacity onPress={() => this.props.onPressLogout()}>
          <View style={styles.optionContainer}>
            <Icon
              name='sign-out'
              color='white'
              size={20}
              style={styles.optionIcon}
            />
            <Text style={[styles.text, styles.optionText]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#6119BD'
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 80,
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'column',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarName: {
  },
  optionContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  categoryContainer: {
    flexDirection: 'column'
  },
  categoryOptionContainer: {
    height: 40,
    justifyContent: 'center'
  },
  flatListStyle: {
    marginLeft: 50
  },
  optionIcon: {
    marginLeft: 15
  },
  optionText: {
    marginLeft: 15
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  separatorStyle: {
    backgroundColor: '#AB84D8'
  }
});
