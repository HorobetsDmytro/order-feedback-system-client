import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Box,
    TableContainer,
    Card,
    CardContent
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { productsService } from '../../services/api';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        image: null,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsService.getAll({ pageSize: 1000 });
            setProducts(response.data.items || []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        setCurrentProduct(null);
        setFormValues({ name: '', price: '', stock: '', description: '', image: null });
        setOpen(true);
    };

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setFormValues({ ...product, image: null });
        setOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await productsService.delete(id);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setViewOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormValues({ ...formValues, image: file });
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', formValues.name);
            formData.append('price', formValues.price);
            formData.append('stock', formValues.stock);
            formData.append('description', formValues.description);
            if (formValues.image) {
                formData.append('image', formValues.image);
            }

            if (currentProduct) {
                await productsService.update(currentProduct.id, formData);
            } else {
                await productsService.create(formData);
            }

            setOpen(false);
            fetchProducts();
        } catch (err) {
            console.error('Failed to save product:', err);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Управління товарами</Typography>

            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddProduct}
                sx={{ mb: 2 }}
            >
                Додати товар
            </Button>

            {loading ? (
                <CircularProgress />
            ) : products.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><b>Назва</b></TableCell>
                                <TableCell><b>Ціна</b></TableCell>
                                <TableCell><b>Наявність</b></TableCell>
                                <TableCell><b>Дії</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id} hover>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price} ₴</TableCell>
                                    <TableCell>{product.stock > 0 ? 'Є в наявності' : 'Немає в наявності'}</TableCell>
                                    <TableCell>
                                        <Button size="small" color="primary" onClick={() => handleEditProduct(product)}>
                                            <Edit />
                                        </Button>
                                        <Button size="small" color="secondary" onClick={() => handleDeleteProduct(product.id)}>
                                            <Delete />
                                        </Button>
                                        <Button size="small" color="info" onClick={() => handleViewProduct(product)}>
                                            <Visibility />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>Товарів поки немає.</Typography>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{currentProduct ? 'Редагувати товар' : 'Додати товар'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Назва"
                        value={formValues.name}
                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Ціна"
                        type="number"
                        value={formValues.price}
                        onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Наявність"
                        type="number"
                        value={formValues.stock}
                        onChange={(e) => setFormValues({ ...formValues, stock: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Опис"
                        value={formValues.description}
                        onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />
                    <input type="file" onChange={handleImageChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Скасувати
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Зберегти
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Деталі товару</DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <Card sx={{ boxShadow: 3, p: 2 }}>
                            <CardContent>
                                <Typography variant="h5">{selectedProduct.name}</Typography>
                                <Typography>Ціна: ${selectedProduct.price}</Typography>
                                <Typography>Наявність: {selectedProduct.stock > 0 ? selectedProduct.stock : 'Немає в наявності'}</Typography>
                                <Typography>Опис: {selectedProduct.description}</Typography>
                                {selectedProduct.imagePath && (
                                    <Box mt={2}>
                                        <img
                                            src={`https://localhost:7104${selectedProduct.imagePath}`}
                                            alt={selectedProduct.name}
                                            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                        />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpen(false)} color="primary">
                        Закрити
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminProductsPage;
