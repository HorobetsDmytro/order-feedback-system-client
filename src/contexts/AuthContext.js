import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, logout } from '../store/slices/authSlice';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); // Отримуємо дані користувача з Redux

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.getCurrentUser()
                .then(response => {
                    console.log('Setting user:', response.data); // Логування для перевірки
                    dispatch(setUser(response.data)); // Оновлюємо стан Redux
                })
                .catch(err => {
                    console.error('Failed to fetch current user:', err);
                    dispatch(logout()); // Якщо токен недійсний, виходимо
                })
                .finally(() => dispatch(setLoading(false)));
        } else {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('token', response.data.token);
            dispatch(setUser(response.data.user)); // Оновлюємо стан Redux
            return response;
        } catch (err) {
            console.error('Login failed:', err);
            throw err; // Передаємо помилку далі
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (err) {
            console.error('Registration failed:', err);
            throw err; // Передаємо помилку далі
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout()); // Скидаємо стан Redux
    };

    const value = {
        user,
        login,
        register,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};