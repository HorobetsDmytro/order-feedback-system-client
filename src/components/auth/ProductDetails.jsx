import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {cartService, productsService, reviewsService} from '../../services/api';

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
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <img
                        src={product.imagePath || '/placeholder.png'}
                        alt={product.name}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="mb-4">
                        <span className="text-2xl font-bold">${product.price}</span>
                    </div>
                    <div className="mb-4">
                        <span className="font-semibold">Stock:</span> {product.stock}
                    </div>
                    {rating !== null && (
                        <div className="mb-4">
                            <span className="font-semibold">Average Rating:</span> {rating.toFixed(1)}/5
                        </div>
                    )}
                    <button
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                        disabled={product.stock === 0}
                        onClick={() => cartService.addItem(product.id, 1)}
                    >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;