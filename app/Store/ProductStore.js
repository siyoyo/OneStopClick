const { createStore } = require('redux');

const defaultState = {
    selectedProduct: {
        productId: ''
    }
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_SELECTED_PRODUCT':
            return {
                ...state,
                selectedProduct: {
                    username: action.productId || state.productId
                }
            }
        default:
            return state;
    }
}

const ProductStore = createStore(reducer);

ProductStore.subscribe(() => {
    return ProductStore.getState();
});

module.exports = ProductStore;
