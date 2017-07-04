const { createStore } = require('redux');

const defaultState = {
    selectedProduct: {
        productId: ''
    },
    shoppingCartProduct: [],
    totalAmount:0
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_SELECTED_PRODUCT':
            return {
                ...state,
                selectedProduct: {
                    productId: action.productId || state.productId
                }
            }
        case 'UPDATE_SHOPPING_CART':
            return{
                ...state,
                shoppingCartProduct: action.shoppingCartProduct || state.shoppingCartProduct
            }
        case 'UPDATE_TOTAL_AMOUNT':
            return{
                ...state,
                totalAmount: action.totalAmount || state.totalAmount
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
