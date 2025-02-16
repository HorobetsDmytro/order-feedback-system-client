import React, { useState } from 'react';
import { reviewsService } from '../../services/api';

const ReviewForm = ({ orderId }) => {
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await reviewsService.create({
                orderId,
                ...formData
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Thank you for your review!
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            <div>
                <label className="block mb-2">Rating</label>
                <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                >
                    {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-2">Comment</label>
                <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;