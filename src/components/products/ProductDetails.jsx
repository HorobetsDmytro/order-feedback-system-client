import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsService, reviewsService } from '../../services/api';
import { Box, Typography, Button, Rating, CircularProgress, Alert } from '@mui/material';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const [productResponse, ratingResponse] = await Promise.all([
                    productsService.getById(id),
                    reviewsService.getProductRating(id)
                ]);
                setProduct(productResponse.data);
                setRating(ratingResponse.data);
            } catch (err) {
                setError('Не вдалося завантажити деталі товару');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!product) return <Typography>Товар не знайдено</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                {product.name}
            </Typography>
            <Typography variant="body1">{product.description}</Typography>
            <Typography variant="h5">${product.price}</Typography>
            <Typography>Наявність: {product.stock > 0 ? 'Є в наявності' : 'Немає в наявності'}</Typography>
            {rating !== null && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Середня оцінка: {rating.toFixed(1)}/5</Typography>
                    <Rating value={rating} precision={0.1} readOnly />
                </Box>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={() => alert('Товар додано до кошика')}
                disabled={product.stock <= 0}
                sx={{ mt: 2 }}
            >
                {product.stock > 0 ? 'Додати до кошика' : 'Немає в наявності'}
            </Button>
        </Box>
    );
};

export default ProductDetails;