// components/cart/Cart.jsx
import React, { useEffect, useState } from 'react';
import { cartService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import CartItem from "./CartItem";
import {Button, Typography} from "@mui/material";

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleCheckout = () => {
        const orderItems = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        navigate('/checkout', { state: { orderItems } });
    };

    if (loading) return <div>Завантаження...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Кошик</h1>

            {(!cart?.items || cart.items.length === 0) ? (
                <p>Ваш кошик порожній</p>
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
                    <div className="mt-4">
                        <Typography variant="h6">Загальна сума: ${calculateTotal().toFixed(2)}</Typography>
                        <Button variant="contained" color="primary" onClick={handleCheckout}>
                            Перейти до оформлення
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;