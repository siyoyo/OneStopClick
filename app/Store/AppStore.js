const { createStore } = require('redux');

const defaultState = {
    selectedNavigation: {
        navigationId: 1,
        categoryId: 1
    }
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_SELECTED_NAVIGATION':
            return {
                ...state,
                selectedNavigation: {
                    navigationId: action.navigationId || state.selectedNavigation.navigationId,
                    categoryId: action.categoryId || state.selectedNavigation.categoryId
                }
            }
        default:
            return state;
    }
}

const AppStore = createStore(reducer);

AppStore.subscribe(() => {
    return AppStore.getState();
});

module.exports = AppStore;
