import React, { useEffect, useState } from 'react';
import { reviewsService } from '../../services/api';
import {
    Box,
    Typography,
    List,
    ListItem,
    Divider,
    Alert,
    Button,
    TextField,
    Rating,
    CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const ReviewList = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [updatedReview, setUpdatedReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await reviewsService.getProductReviews(productId);
                setReviews(response.data);
            } catch (err) {
                setError('Не вдалося завантажити відгуки');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    const handleEdit = (review) => {
        setEditingReview(review.id);
        setUpdatedReview({ rating: review.rating, comment: review.comment });
    };

    const handleUpdateReview = async (reviewId) => {
        try {
            await reviewsService.update(reviewId, updatedReview);
            setReviews((prevReviews) =>
                prevReviews.map((r) => (r.id === reviewId ? { ...r, ...updatedReview } : r))
            );
            setEditingReview(null);
            toast.success('Відгук оновлено!');
        } catch (err) {
            toast.error('Не вдалося оновити відгук');
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Відгуки</Typography>
            {reviews.length > 0 ? (
                <List>
                    {reviews.map((review) => (
                        <React.Fragment key={review.id}>
                            <ListItem alignItems="flex-start">
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Автор: {review.user.username || 'Невідомий'} | Дата: {new Date(review.createdAt).toLocaleDateString()}
                                    </Typography>

                                    {editingReview === review.id ? (
                                        <Rating
                                            name="rating"
                                            value={updatedReview.rating}
                                            onChange={(e, newValue) =>
                                                setUpdatedReview((prev) => ({ ...prev, rating: newValue }))
                                            }
                                            sx={{ mb: 1 }}
                                        />
                                    ) : (
                                        <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                                    )}

                                    {editingReview === review.id ? (
                                        <>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={updatedReview.comment}
                                                onChange={(e) =>
                                                    setUpdatedReview((prev) => ({ ...prev, comment: e.target.value }))
                                                }
                                                sx={{ mt: 1 }}
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={() => handleUpdateReview(review.id)}
                                                sx={{ mt: 1 }}
                                            >
                                                Зберегти
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography>{review.comment}</Typography>
                                    )}

                                    {user?.id === review.userId && editingReview !== review.id && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleEdit(review)}
                                            sx={{ mt: 1 }}
                                        >
                                            Редагувати
                                        </Button>
                                    )}
                                </Box>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            ) : (
                <Typography>Відгуків поки немає.</Typography>
            )}
        </Box>
    );
};

export default ReviewList;