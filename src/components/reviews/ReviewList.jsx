// components/reviews/ReviewList.jsx
import React, { useEffect, useState } from 'react';
import { reviewsService } from '../../services/api';

const ReviewList = ({ productId, orderId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterRating, setFilterRating] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [productId, orderId, filterRating]);

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
            setError('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Filter by Rating</label>
                <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value={0}>All Ratings</option>
                    {[5, 4, 3, 2, 1].map(rating => (
                        <option key={rating} value={rating}>{rating} Stars</option>
                    ))}
                </select>
            </div>

            {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet</p>
            ) : (
                reviews.map(review => (
                    <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-yellow-400 text-lg">
                                    {renderStars(review.rating)}
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            By {review.user?.username || 'Anonymous'}
                        </div>
                        {review.updatedAt && (
                            <div className="mt-1 text-xs text-gray-400">
                                Edited: {new Date(review.updatedAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;