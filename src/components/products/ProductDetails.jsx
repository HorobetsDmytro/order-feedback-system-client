import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsService, reviewsService } from '../../services/api';
import {
    Box,
    Typography,
    Button,
    Rating,
    CircularProgress,
    Alert,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    CardMedia,
    Grid
} from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const [productResponse, ratingResponse, reviewsResponse] = await Promise.all([
                    productsService.getById(id),
                    reviewsService.getProductRating(id),
                    reviewsService.getOrderReviews(id)
                ]);
                setProduct(productResponse.data);
                setRating(ratingResponse.data);
                setReviews(reviewsResponse.data);
            } catch (err) {
                setError('Не вдалося завантажити деталі товару');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((prev) => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
    };

    const handleSubmitReview = async () => {
        if (!user) {
            toast.error('Будь ласка, увійдіть, щоб залишити відгук');
            return;
        }

        if (!reviewForm.comment.trim()) {
            toast.warning('Будь ласка, введіть коментар');
            return;
        }

        setSubmitting(true);
        try {
            await reviewsService.create({
                productId: id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            setReviews((prev) => [
                ...prev,
                { rating: reviewForm.rating, comment: reviewForm.comment, createdAt: new Date().toISOString() }
            ]);
            setReviewForm({ rating: 5, comment: '' });
            toast.success('Відгук успішно додано!');
        } catch (err) {
            toast.error('Не вдалося залишити відгук');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Будь ласка, увійдіть, щоб додати товар до кошика');
            return;
        }

        toast.success('Товар додано до кошика!');
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!product) return <Typography>Товар не знайдено</Typography>;

    const baseUrl = "https://localhost:7104";

    return (
        <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <CardMedia
                        component="img"
                        image={
                            product.imagePath && product.imagePath.trim()
                                ? `${baseUrl}${product.imagePath}`
                                : "https://via.placeholder.com/400"
                        }
                        alt={product.name}
                        sx={{
                            width: "100%",
                            height: 450,
                            objectFit: "contain",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "8px",
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {product.description}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                        {product.price} ₴
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
                        Наявність: {product.stock > 0 ? 'Є в наявності' : 'Немає в наявності'}
                    </Typography>

                    {rating !== null && (
                        <Box sx={{ mt: 2 }}>
                            <Typography>Середня оцінка: {rating.toFixed(1)}/5</Typography>
                            <Rating value={rating} precision={0.1} readOnly />
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        sx={{ mt: 2, width: "100%" }}
                    >
                        {product.stock > 0 ? 'Додати до кошика' : 'Немає в наявності'}
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Залишити відгук</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ mr: 2 }}>Оцінка:</Typography>
                    <Rating
                        name="rating"
                        value={reviewForm.rating}
                        onChange={handleReviewChange}
                        precision={1}
                    />
                </Box>
                <TextField
                    fullWidth
                    label="Ваш коментар"
                    name="comment"
                    multiline
                    rows={3}
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                >
                    {submitting ? 'Надсилаємо...' : 'Залишити відгук'}
                </Button>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Відгуки</Typography>
                {reviews.length > 0 ? (
                    <List>
                        {reviews.map((review, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText
                                        primary={`Оцінка: ${review.rating}`}
                                        secondary={review.comment}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography>Відгуків поки немає.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ProductDetails;
