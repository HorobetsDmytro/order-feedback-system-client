import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersService } from '../../services/api';
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, Alert } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const translateStatus = (status) => {
        const statusMap = {
            0: 'В очікуванні',
            1: 'Обробка',
            2: 'Відправлено',
            3: 'Доставлено',
            4: 'Скасовано',
        };
        return statusMap[status] || 'Невідомий статус';
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await ordersService.updateStatus(orderId, 4);
            setOrders((prevOrders) => prevOrders.map(order =>
                order.id === orderId ? { ...order, status: 4 } : order
            ));
            toast.success('Замовлення успішно скасовано');
        } catch (err) {
            toast.error('Не вдалося скасувати замовлення');
        }
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}>Завантаження...</Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom align="center">
                Мої замовлення
            </Typography>
            {orders.length === 0 ? (
                <Typography align="center">У вас немає замовлень</Typography>
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
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <ListItemText
                                    primary={`Замовлення #${order.orderNumber}`}
                                    secondary={`Статус: ${translateStatus(order.status)} | Дата: ${new Date(order.createdAt).toLocaleDateString()} | Сума: ${order.totalAmount} ₴`}
                                />
                                {order.status === 0 ? (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCancelOrder(order.id);
                                        }}
                                    >
                                        Скасувати
                                    </Button>
                                ) : order.status === 4 ? (
                                    <Typography color="error" fontWeight="bold">Скасовано</Typography>
                                ) : null}
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