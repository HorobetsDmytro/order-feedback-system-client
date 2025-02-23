import React, { useEffect, useState } from 'react';
import { cartService, ordersService } from '../../services/api';
import CartItem from "./CartItem";
import { Button, Typography, Paper, Box, CircularProgress, Alert } from "@mui/material";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await cartService.getCart();
            setCart(response.data);
        } catch (err) {
            setError('Не вдалося завантажити кошик');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        try {
            await cartService.updateQuantity(productId, quantity);
            fetchCart();
        } catch (err) {
            console.error('Не вдалося оновити кількість:', err);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeItem(productId);
            fetchCart();
        } catch (err) {
            console.error('Не вдалося видалити товар:', err);
        }
    };

    const calculateTotal = () => {
        return cart?.items.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
    };

    const handleCheckout = async () => {
        if (!cart?.items || cart.items.length === 0) {
            setError('Кошик порожній. Додайте товари перед оформленням замовлення.');
            return;
        }

        try {
            const orderItems = cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            await ordersService.create(orderItems);

            await cartService.clearCart();
            fetchCart();

            setSuccessMessage('Замовлення успішно створено!');
            setError('');
        } catch (err) {
            console.error('Не вдалося створити замовлення:', err);
            setError('Сталася помилка при створенні замовлення.');
            setSuccessMessage('');
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
    if (error) return <Typography color="error" textAlign="center">{error}</Typography>;

    return (
        <Box maxWidth="800px" mx="auto" mt={4} p={3} component={Paper} elevation={3} borderRadius={2}>
            <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">🛒 Ваш кошик</Typography>
            {(!cart?.items || cart.items.length === 0) ? (
                <Typography variant="h6" textAlign="center" color="textSecondary">Ваш кошик порожній</Typography>
            ) : (
                <>
                    {cart.items.map(item => (
                        <CartItem
                            key={item.productId}
                            item={item}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemoveItem}
                        />
                    ))}
                    <Box mt={3} p={2} bgcolor="whitesmoke" borderRadius={2} textAlign="right">
                        <Typography variant="h6" fontWeight="bold">Загальна сума: ${calculateTotal().toFixed(2)}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleCheckout}
                            sx={{ mt: 2, borderRadius: 3 }}
                        >
                            ✅ Оформити замовлення
                        </Button>
                    </Box>
                </>
            )}
            {successMessage && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    {successMessage}
                </Alert>
            )}
        </Box>
    );
};

export default Cart;