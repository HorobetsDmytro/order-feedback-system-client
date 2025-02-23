import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Pagination, Grid } from '@mui/material';
import ProductCard from './products/ProductCard';
import { productsService } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: searchParams.get('sortBy') || 'name',
        sortOrder: searchParams.get('sortOrder') || 'asc',
    });
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 9;

    const debouncedFetch = debounce(fetchProducts, 300);

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        params.set('page', page.toString());
        setSearchParams(params);

        debouncedFetch();

        return () => {
            debouncedFetch.cancel();
        };
    }, [filters, page]);

    async function fetchProducts() {
        setLoading(true);
        try {
            const params = {
                search: filters.search?.trim() || null,
                minPrice: filters.minPrice ? Number(filters.minPrice) : null,
                maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                page,
                limit: itemsPerPage,
            };

            const response = await productsService.getAll(params);

            if (response.data && Array.isArray(response.data.items)) {
                setProducts(response.data.items);
                setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
                setError('');
            } else {
                throw new Error('Некоректні дані від сервера');
            }
        } catch (err) {
            console.error('❌ Помилка при завантаженні товарів:', err);
            setError('Не вдалося завантажити товари');
        } finally {
            setLoading(false);
        }
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
        setPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}>Завантаження...</Box>;
    if (error) return <Box sx={{ textAlign: 'center', mt: 4, color: 'error.main' }}>{error}</Box>;

    return (
        <Box sx={{ display: 'flex', p: 4 }}>
            <Box sx={{ width: 300, mr: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Фільтри
                </Typography>
                <TextField
                    fullWidth
                    label="Пошук"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="Мін. ціна"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Макс. ціна"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        sx={{ flex: 1 }}
                    />
                </Box>
                <Select
                    fullWidth
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="name">За назвою</MenuItem>
                    <MenuItem value="price">За ціною</MenuItem>
                </Select>
                <Select
                    fullWidth
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="asc">За зростанням</MenuItem>
                    <MenuItem value="desc">За спаданням</MenuItem>
                </Select>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        🛍️ Товари
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <ProductCard
                                product={product}
                                onDetailsClick={() => navigate(`/products/${product.id}`)}
                            />
                        </Grid>
                    ))}
                </Grid>

                {products.length === 0 && !loading && (
                    <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                        Товарів не знайдено
                    </Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;