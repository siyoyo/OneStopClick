const React = require('react');
const {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity
} = require('react-native');
const { Component } = React;

import Icon from 'react-native-vector-icons/FontAwesome'

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
const UserStore = require('../Store/UserStore');
const Separator = require('./Separator');

module.exports = class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: UserStore.getState().user.username,
      categoryData: []
    }
  }

  _goToHome() {
    alert('pressed');
  }

  _logOut() {
    alert('pressed');
  }

  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri, }} />
          <Text style={[styles.text, styles.avatarName]} numberOfLines={2} >{this.state.username}</Text>
        </View>
        <Separator separatorStyle={styles.separatorStyle} />
        <TouchableOpacity onPress={() => this._goToHome()}>
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
        <TouchableOpacity onPress={() => this._logOut()}>
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
        <View style={styles.optionContainer}>
          <Icon
            name='list-ol'
            color='white'
            size={20}
            style={styles.optionIcon}
          />
          <Text style={[styles.text, styles.optionText]}>Category</Text>
        </View>
        <Separator separatorStyle={styles.separatorStyle} />
        <TouchableOpacity onPress={() => this._logOut()}>
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
        <TouchableOpacity onPress={() => this._logOut()}>
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
    backgroundColor: '#350863'
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  avatarName: {
    marginLeft: 15,

  },
  optionContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
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
    backgroundColor: '#6119BD'
  }
});
