import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ordersService } from '../../services/api';
import { Box, Typography, List, ListItem, ListItemText, Button, Alert } from '@mui/material';

const CreateOrder = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [loading, setLoading] = useState(false);
    const [setError] = useState('');

    const handleCreateOrder = async () => {
        if (!state?.orderItems) {
            setError('Немає товарів для замовлення');
            return;
        }

        setLoading(true);
        try {
            const response = await ordersService.create(state.orderItems);
            navigate(`/orders/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data || 'Не вдалося створити замовлення');
        } finally {
            setLoading(false);
        }
    };

    if (!state?.orderItems) {
        return <Alert severity="error">Немає товарів для замовлення</Alert>;
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Підтвердіть замовлення
            </Typography>
            <Typography variant="h6">Підсумок замовлення:</Typography>
            <List>
                {state.orderItems.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`Товар ID: ${item.productId}`}
                            secondary={`Кількість: ${item.quantity}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOrder}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? 'Обробка...' : 'Підтвердити замовлення'}
            </Button>
        </Box>
    );
};

export default CreateOrder;