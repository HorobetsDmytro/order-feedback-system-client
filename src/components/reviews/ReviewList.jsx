import React, { useEffect, useState } from 'react';
import { reviewsService } from '../../services/api';
import { Box, Typography, List, ListItem, ListItemText, Divider, Alert, Select, MenuItem } from '@mui/material';

const ReviewList = ({ productId, orderId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterRating, setFilterRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                let response;
                if (orderId) {
                    response = await reviewsService.getOrderReviews(orderId);
                } else if (filterRating > 0) {
                    response = await reviewsService.getFilteredReviews(filterRating);
                }
                setReviews(response.data);
            } catch (err) {
                setError('Не вдалося завантажити відгуки');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, orderId, filterRating]);

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}>Завантаження відгуків...</Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Відгуки
            </Typography>
            <Select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                sx={{ mb: 2 }}
                fullWidth
            >
                <MenuItem value={0}>Всі оцінки</MenuItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <MenuItem key={rating} value={rating}>
                        {rating} Зірки
                    </MenuItem>
                ))}
            </Select>
            {reviews.length === 0 ? (
                <Typography>Відгуків ще немає</Typography>
            ) : (
                <List>
                    {reviews.map((review) => (
                        <React.Fragment key={review.id}>
                            <ListItem>
                                <ListItemText
                                    primary={renderStars(review.rating)}
                                    secondary={review.comment}
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

export default ReviewList;