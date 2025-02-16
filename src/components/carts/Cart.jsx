// components/cart/Cart.jsx
import React, { useEffect, useState } from 'react';
import { cartService } from '../../services/api';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';

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
            setError('Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        try {
            await cartService.updateQuantity(productId, quantity);
            fetchCart();
        } catch (err) {
            console.error('Failed to update quantity:', err);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeItem(productId);
            fetchCart();
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    };

    const calculateTotal = () => {
        return cart?.items.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
    };

    const handleCheckout = () => {
        // Перетворення елементів кошика в формат для створення замовлення
        const orderItems = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        navigate('/checkout', { state: { orderItems } });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            {(!cart?.items || cart.items.length === 0) ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Your cart is empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {cart.items.map(item => (
                        <CartItem
                            key={item.productId}
                            item={item}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemoveItem}
                        />
                    ))}
                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-xl">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
