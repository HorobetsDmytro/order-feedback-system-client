import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        setCartItems: (state, action) => {
            state.items = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setCartItems, setLoading, setError } = cartSlice.actions;
export default cartSlice.reducer;