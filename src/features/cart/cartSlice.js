import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cart: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            //payload = new cart item
            state.cart.push(action.payload);
        },
        deleteItem(state, action) {
            //payload = id of the item to delete
            state.cart = state.cart.filter((item) => {
                return item.pizzaId !== action.payload;
            });
        },
        increaseQuantity(state, action) {
            //payload = pizza id
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload
            );
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
        },
        decreaseQuantity(state, action) {
            //payload = pizza id
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload
            );
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice;

            if (item.quantity === 0)
                cartSlice.caseReducers.deleteItem(state, action);
        },
        clearCart(state) {
            state.cart = [];
        },
    },
});

export const {
    addItem,
    deleteItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
    state.cart.cart.reduce((acc, curr) => acc + curr.quantity, 0);

export const getTotalCartPrice = (state) =>
    state.cart.cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

export const getCurrentQuantityById = (id) => (state) =>
    state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
