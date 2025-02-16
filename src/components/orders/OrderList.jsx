import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersService } from '../../services/api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await ordersService.getUserOrders();
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                                    <p className="text-gray-600">
                                        Status: {order.status}
                                    </p>
                                    <p className="text-gray-600">
                                        Total: ${order.totalAmount}
                                    </p>
                                </div>
                                <Link
                                    to={`/orders/${order.id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};