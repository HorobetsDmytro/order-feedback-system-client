import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersService } from '../../services/api';
import { Box, Typography, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';

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
                setError('Не вдалося завантажити замовлення');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}>Завантаження...</Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Мої замовлення
            </Typography>
            {orders.length === 0 ? (
                <Typography>У вас немає замовлень</Typography>
            ) : (
                <List>
                    {orders.map((order) => (
                        <React.Fragment key={order.id}>
                            <ListItem
                                component={Link}
                                to={`/orders/${order.id}`}
                                sx={{
                                    textDecoration: 'none',
                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                }}
                            >
                                <ListItemText
                                    primary={`Замовлення #${order.orderNumber}`}
                                    secondary={
                                        <>
                                            Статус: {order.status} | Дата: {new Date(order.createdAt).toLocaleDateString()} | Сума: ${order.totalAmount}
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default OrderList;