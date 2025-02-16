import React, { useState } from 'react';
import { reviewsService } from '../../services/api';
import { Box, Typography, TextField, Button, Rating, Alert } from '@mui/material';

const ReviewForm = ({ orderId }) => {
    const [formData, setFormData] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await reviewsService.create({ orderId, ...formData });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data || 'Не вдалося надіслати відгук');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return <Alert severity="success">Дякуємо за ваш відгук!</Alert>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h6">Оцінка:</Typography>
            <Rating
                name="rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Коментар"
                multiline
                rows={4}
                fullWidth
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                sx={{ mb: 2 }}
                required
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Надсилається...' : 'Надіслати відгук'}
            </Button>
        </Box>
    );
};

export default ReviewForm;