import React, { createContext, useReducer } from "react";

// Create Context
export const CartContext = createContext();

// Initial State
const initialState = {
  cart: [],
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const item = state.cart.find((i) => i.id === action.payload.id);
      if (item) {
        // Update item quantity
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: action.payload.quantity }
              : i
          ),
        };
      } else {
        // Add new item to cart
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [], // Empty the cart
      };
    default:
      return state;
  }
};

// Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cart: state.cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
