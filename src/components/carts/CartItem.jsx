import React from 'react';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    return (
        <div className="flex items-center border rounded-lg p-4 shadow-sm">
            <img
                src={item.product?.imagePath || '/placeholder.png'}
                alt={item.product?.name}
                className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-grow ml-4">
                <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                <p className="text-gray-600">${item.price}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                    <button
                        className="px-3 py-1 hover:bg-gray-100"
                        onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                        className="px-3 py-1 hover:bg-gray-100"
                        onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={() => onRemove(item.productId)}
                    className="text-red-500 hover:text-red-700"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;