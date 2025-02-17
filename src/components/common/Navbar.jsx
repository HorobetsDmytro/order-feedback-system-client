import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    console.log('User:', user);
    const { items } = useSelector((state) => state.cart);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    console.log('User:', user); // Логування для перевірки

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Логотип або назва системи */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Система Замовлень
                </Typography>

                {user && (
                    <>
                        <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
                            Вітаємо, {user.username}
                        </Typography>
                    </>
                )}

                {/* Кнопка "Товари" */}
                <Button color="inherit" component={Link} to="/products">
                    Головна
                </Button>

                {/* Додаткові кнопки для адміністратора */}
                {user?.role === 'Admin' && (
                    <>
                        <Button color="inherit" component={Link} to="/admin/products">
                            Товари
                        </Button>
                        <Button color="inherit" component={Link} to="/admin/orders">
                            Замовлення
                        </Button>
                    </>
                )}

                {/* Кнопки для авторизованих користувачів */}
                {user && (
                    <>
                        <Button color="inherit" component={Link} to="/orders">
                            Мої замовлення
                        </Button>
                        <IconButton color="inherit" component={Link} to="/cart">
                            <Badge badgeContent={items?.length} color="error">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                        <Button color="inherit" onClick={handleLogout}>
                            Вийти
                        </Button>
                    </>
                )}

                {/* Кнопки для неавторизованих користувачів */}
                {!user && (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Увійти
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Зареєструватися
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;