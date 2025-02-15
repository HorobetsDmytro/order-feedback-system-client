import React from 'react';
import { Link } from 'react-router-dom';
import { cartService } from '../../services/api';

const ProductCard = ({ product }) => {
    const handleAddToCart = async () => {
        try {
            await cartService.addItem(product.id, 1);
            // You might want to show a success message or update cart state here
        } catch (err) {
            console.error('Failed to add to cart:', err);
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden shadow-lg">
            <img
                src={product.imagePath || '/placeholder.png'}
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${product.price}</span>
                    <div className="space-x-2">
                        <Link
                            to={`/products/${product.id}`}
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Details
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;