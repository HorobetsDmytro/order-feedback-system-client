import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ordersService } from '../../services/api';
import ReviewForm from '../reviews/ReviewForm';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersService.getById(id);
                setOrder(response.data);
            } catch (err) {
                setError('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Order Details #{order.orderNumber}</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Order Information</h2>
                    <p>Status: {order.status}</p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Total Amount: ${order.totalAmount}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Items</h2>
                    <div className="grid gap-4">
                        {order.orderItems.map(item => (
                            <div key={item.id} className="border rounded p-4">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price per unit: ${item.unitPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {!order.review && order.status === 'Completed' && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Leave a Review</h2>
                        <ReviewForm orderId={order.id} />
                    </div>
                )}
            </div>
        </div>
    );
};