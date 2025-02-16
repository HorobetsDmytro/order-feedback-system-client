import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            OrderSystem
                        </Link>
                        <Link to="/products" className="text-gray-600 hover:text-gray-800">
                            Products
                        </Link>
                        {token && (
                            <>
                                <Link to="/orders" className="text-gray-600 hover:text-gray-800">
                                    Orders
                                </Link>
                                <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                                    Cart
                                </Link>
                            </>
                        )}
                    </div>
                    <div>
                        {token ? (
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;