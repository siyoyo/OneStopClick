import * as types from '../Helpers/actionTypes'

export function setUserId(userId) {
    console.log('setting action user id ', userId   )
    return (dispatch, getState) => {
        dispatch({
            type: types.USER_ID,
            userId
        })
    }
}

export function setDisplayName(displayName){
    console.log ('action display name', displayName)
    return (dispatch, getState) =>{
        dispatch({
            type: types.DISPLAYNAME,
            displayName
        })
    }
}

export function setEmail(email) {
    console.log('action email', email)
    return(dispatch, getState) => {
        dispatch({
            type: types.EMAIL,
            email
        })
    }
}

export function getUserId(userId) {
    console.log('get userId action')
    return (dispatch, getState) => {
        var budget = 0

        settingRef.on('value', (settings) => {
            settings.forEach((setting) => {
                budget = setting.val().budget
            })
        })

        dispatch({
            type: types.USER_ID,
            userId,
        })
    }
}