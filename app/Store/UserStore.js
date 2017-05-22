const { createStore } = require('redux');

const defaultState = {
    user: {
        username: ''
    },
    accessToken: ''
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: {
                    username: action.username || state.username
                }
            };
        case 'UPDATE_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: action.accessToken || state.accessToken
            }
        case 'LOGOUT':
            return state = defaultState;
        default:
            return state;
    }
}

const UserStore = createStore(reducer);

UserStore.subscribe(() => {
    return UserStore.getState();
});

module.exports = UserStore;
