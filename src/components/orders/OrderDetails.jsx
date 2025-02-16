import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ordersService } from '../../services/api';
import ReviewForm from '../reviews/ReviewForm';
import { Box, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';

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
                setError('Не вдалося завантажити деталі замовлення');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}>Завантаження...</Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!order) return <Typography>Замовлення не знайдено</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Деталі замовлення #{order.orderNumber}
            </Typography>
            <Typography>
                Статус: {order.status} | Дата: {new Date(order.createdAt).toLocaleDateString()} | Сума: ${order.totalAmount}
            </Typography>
            <Typography variant="h6" mt={2}>
                Товари:
            </Typography>
            <List>
                {order.orderItems.map((item) => (
                    <ListItem key={item.id}>
                        <ListItemText
                            primary={item.product.name}
                            secondary={`Кількість: ${item.quantity} | Ціна за одиницю: $${item.unitPrice}`}
                        />
                    </ListItem>
                ))}
            </List>
            {!order.review && order.status === 'Completed' && (
                <Box mt={4}>
                    <Typography variant="h6">Залиште відгук:</Typography>
                    <ReviewForm orderId={order.id} />
                </Box>
            )}
        </Box>
    );
};

export default OrderDetails;