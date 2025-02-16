import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { cartService } from '../../services/api';

const ProductCard = ({ product }) => {
    const handleAddToCart = async () => {
        try {
            await cartService.addItem(product.id, 1);
            alert('Товар додано до кошика');
        } catch (err) {
            console.error('Не вдалося додати товар до кошика:', err);
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="140"
                image={product.imagePath || 'https://via.placeholder.com/150'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="h6">${product.price}</Typography>
            </CardContent>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                sx={{ m: 2 }}
            >
                {product.stock > 0 ? 'Додати до кошика' : 'Немає в наявності'}
            </Button>
        </Card>
    );
};

export default ProductCard;