import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Pagination, Grid } from '@mui/material';
import ProductCard from './products/ProductCard';
import { productsService } from '../services/api';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'name', // name, price
        sortOrder: 'asc', // asc, desc
    });
    const [page, setPage] = useState(1); // Поточна сторінка
    const [totalPages, setTotalPages] = useState(1); // Загальна кількість сторінок
    const itemsPerPage = 9; // Кількість товарів на сторінці (3 ряди по 3 товари)

    useEffect(() => {
        fetchProducts();
    }, [filters, page]);

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
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1); // Скидаємо сторінку при зміні фільтрів
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}>Завантаження...</Box>;
    if (error) return <Box sx={{ textAlign: 'center', mt: 4 }}>{error}</Box>;

    return (
        <Box sx={{ display: 'flex', p: 4 }}>
            {/* Ліва панель з фільтрами */}
            <Box sx={{ width: 250, mr: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Фільтри
                </Typography>

                {/* Пошук */}
                <TextField
                    fullWidth
                    label="Пошук"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    sx={{ mb: 2 }}
                />

                {/* Ціновий діапазон */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        label="Мінімальна ціна"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Максимальна ціна"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        sx={{ flex: 1 }}
                    />
                </Box>

                {/* Сортування */}
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
                >
                    <MenuItem value="asc">За зростанням</MenuItem>
                    <MenuItem value="desc">За спаданням</MenuItem>
                </Select>
            </Box>

            {/* Головна частина з товарами */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Товари
                </Typography>

                {/* Список товарів */}
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>

                {/* Пагінація */}
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