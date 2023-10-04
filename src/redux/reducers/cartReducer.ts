import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { CartReducerState } from "../../types/InitialState";
import Product from "../../types/Product";
import CartItem from "../../types/CartItem";

const initialState: CartReducerState = {
  cartItems: []
}

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const cartItem: CartItem = {...action.payload, quantity: 1}
      const foundIndex = state.cartItems.findIndex(item => item.id === action.payload.id)
      if (foundIndex === -1) {
        state.cartItems.push(cartItem)
      } else {
        state.cartItems[foundIndex].quantity++
      }
    },
    deleteFromCart : (state, action: PayloadAction<CartItem>) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id)
    }
  }
})

const cartReducer = cartSlice.reducer
export const {addToCart, deleteFromCart} = cartSlice.actions
export default cartReducer