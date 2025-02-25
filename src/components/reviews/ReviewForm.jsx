import React, { useState } from 'react';
import { reviewsService } from '../../services/api';

const ReviewForm = ({ orderId, onSubmit }) => {
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            orderId: orderId, // Використовуємо правильний ID замовлення
            rating: reviewForm.rating,
            comment: reviewForm.comment
        };

        try {
            await reviewsService.create(reviewData);
            onSubmit(); // Опціонально: виклик функції для оновлення UI після успішного створення
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Rating:</label>
                <select
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleChange}
                >
                    {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>
                            {num} Stars
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Comment:</label>
                <textarea
                    name="comment"
                    value={reviewForm.comment}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;