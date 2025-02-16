import React, { useEffect, useState } from 'react';
import { productsService } from '../../services/api';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'name', // name, price
        sortOrder: 'asc' // asc, desc
    });
    const [page, setPage] = useState(1); // Поточна сторінка
    const [totalPages, setTotalPages] = useState(1); // Загальна кількість сторінок
    const itemsPerPage = 9; // Кількість товарів на сторінці

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productsService.getAll({
                    ...filters,
                    page,
                    limit: itemsPerPage,
                });
                setProducts(response.data.items);
                setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
                setError('');
            } catch (err) {
                setError('Не вдалося завантажити товари');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters, page]); // Перезавантаження при зміні фільтрів або сторінки

    if (loading) return <div className="text-center">Завантаження...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Наші товари</h1>

            {/* Фільтри */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Пошук..."
                    value={filters.search}
                    onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                    }
                    className="border p-2 rounded w-full mb-2"
                />
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Мінімальна ціна"
                        value={filters.minPrice}
                        onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                        }
                        className="border p-2 rounded flex-1"
                    />
                    <input
                        type="number"
                        placeholder="Максимальна ціна"
                        value={filters.maxPrice}
                        onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                        }
                        className="border p-2 rounded flex-1"
                    />
                </div>
                <select
                    value={filters.sortBy}
                    onChange={(e) =>
                        setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="border p-2 rounded mt-2 w-full"
                >
                    <option value="name">За назвою</option>
                    <option value="price">За ціною</option>
                </select>
                <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                        setFilters({ ...filters, sortOrder: e.target.value })
                    }
                    className="border p-2 rounded mt-2 w-full"
                >
                    <option value="asc">За зростанням</option>
                    <option value="desc">За спаданням</option>
                </select>
            </div>

            {/* Список товарів */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Пагінація */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded-l"
                >
                    Назад
                </button>
                <span className="px-4 py-2 bg-gray-200">
                    Сторінка {page} з {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-r"
                >
                    Вперед
                </button>
            </div>
        </div>
    );
};

export default ProductList;