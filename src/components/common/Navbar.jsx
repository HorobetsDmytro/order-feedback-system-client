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
    const { items } = useSelector((state) => state.cart);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Система Замовлень
                </Typography>
                <Button color="inherit" component={Link} to="/products">
                    Товари
                </Button>
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