/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react'
import {
  AppRegistry,
} from 'react-native';
import Navigation from './app/navigation'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './app/Reducers'

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware,
    )
  )
  return createStore(reducer, initialState, enhancer)
}

const store = configureStore({})
const App = () => (
  <Provider store={store}>
    <Navigation/>
  </Provider>
)

AppRegistry.registerComponent('OneStopClick', () => App);
