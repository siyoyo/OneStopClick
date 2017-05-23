import createReducer from '../Helpers/createReducers'
import * as types from '../Helpers/actionTypes'

export const userId = createReducer('', {
    [types.USER_ID](state, action) {
        var newState = action.userId !== undefined ? action.userId : state
        console.log('new state ', newState)
        return newState
    }
})

export const displayName = createReducer('', {
    [types.DISPLAYNAME](state, action){
        var newState = action.displayName !== undefined ? action.displayName : state
        console.log('display name new state', newState)
        return newState
    }
})

export const email = createReducer('', {
    [types.EMAIL](state, action){
        var newState = action.email !== undefined ? action.email : state
        console.log('email state', newState)
        return newState
    }
})
