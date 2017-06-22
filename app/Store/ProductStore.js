const { createStore } = require('redux');

const defaultState = {
    selectedProduct: {
        productId: ''
    },
    shoppingCartProduct: [],
    isShoppingCart: false
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
        case 'UPDATE_STATE_PAGE':
            return{
                ...state,
                isShoppingCart: action.isShoppingCart || state.isShoppingCart
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
