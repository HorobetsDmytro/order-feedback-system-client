import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        user: null,
        loading: false,
        error: null
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem('token', action.payload);
            } else {
                localStorage.removeItem('token');
            }
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
        }
    }
});

export const { setToken, setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;