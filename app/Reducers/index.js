import {combineReducers} from 'redux'
import * as accountReducer from './account'

export default combineReducers(Object.assign(
    accountReducer
))