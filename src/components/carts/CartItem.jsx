import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
                <Typography variant="h6">{item.product?.name}</Typography>
                <Typography variant="body2">Ціна: ${item.price}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => onQuantityChange(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Remove />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => onQuantityChange(item.productId, item.quantity + 1)}>
                    <Add />
                </IconButton>
                <Button
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onRemove(item.productId)}
                >
                    Видалити
                </Button>
            </Box>
        </Box>
    );
};

export default CartItem;