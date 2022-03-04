import { createContext, useReducer } from "react";
import Cookies from 'js-cookie'

export const Store = createContext()
const initialState = {
    darkMode: Cookies.get('darkMode') === 'On' ? true : false,
    cart: {
        cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
        shippingAddress: Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : {},
        paymentMethod: Cookies.get('paymentMethod') ? Cookies.get('paymentMethod') : '',
    },
    userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'Dark_Mode':
            return { ...state, darkMode: !state.darkMode }

        case 'CART_ADD_ITEM':
            const newItem = action.payload
            const existingItem = state.cart.cartItems.find(item => item.name === newItem.name)
            const cartItems = existingItem ?
                state.cart.cartItems.map(item => item.name === existingItem.name ? newItem : item)
                :
                [...state.cart.cartItems, newItem]
            Cookies.set('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }

        case 'CART_REMOVE_ITEM':
            const remainedCartItems = state.cart.cartItems.filter(item => item._id !== action.payload._id)
            Cookies.set('cartItems', JSON.stringify(remainedCartItems))
            return { ...state, cart: { ...state.cart, cartItems: remainedCartItems } }

        case 'USER_LOGIN':
            return { ...state, userInfo: action.payload }

        case 'USER_LOGOUT':
            return {
                ...state,
                userInfo: null,
                cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' }
            }

        case 'SAVE_SHIPPING_ADDRESS':
            return { ...state, cart: { ...state.cart, shippingAddress: action.payload } }

        case 'SAVE_PAYMENT_METHOD':
            return { ...state, cart: { ...state.cart, paymentMethod: action.payload } }

        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } }

        default:
            return state
    }
}

export const StoreProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const value = { state, dispatch }
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}