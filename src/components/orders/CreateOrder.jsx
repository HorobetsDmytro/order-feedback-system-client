import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ordersService } from '../../services/api';

const CreateOrder = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateOrder = async () => {
        if (!state?.orderItems) {
            setError('No items to order');
            return;
        }

        setLoading(true);
        try {
            const response = await ordersService.create(state.orderItems);
            navigate(`/orders/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    if (!state?.orderItems) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-red-500">No items selected for order</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Confirm Your Order</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {state.orderItems.map((item, index) => (
                    <div key={index} className="border-b py-2">
                        <p>Product ID: {item.productId}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                ))}
                <button
                    onClick={handleCreateOrder}
                    disabled={loading}
                    className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : 'Confirm Order'}
                </button>
            </div>
        </div>
    );
};