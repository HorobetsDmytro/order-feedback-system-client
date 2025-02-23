import React from 'react';
import { Box, Typography, Button, IconButton, Paper } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    return (
        <Paper
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2
            }}
        >
            <Box>
                <Typography variant="h6" fontWeight="bold">{item.product?.name}</Typography>
                <Typography variant="body2" color="textSecondary">Ціна: ${item.price}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    sx={{ border: '1px solid #ccc', borderRadius: '50%' }}
                >
                    <Remove />
                </IconButton>
                <Typography fontWeight="bold">{item.quantity}</Typography>
                <IconButton
                    onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                    sx={{ border: '1px solid #ccc', borderRadius: '50%' }}
                >
                    <Add />
                </IconButton>
                <Button
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onRemove(item.productId)}
                    sx={{ borderRadius: 3 }}
                >
                    Видалити
                </Button>
            </Box>
        </Paper>
    );
};

export default CartItem;
