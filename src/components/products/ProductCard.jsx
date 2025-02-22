import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { cartService } from "../../services/api";
import { toast } from 'react-toastify';
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDetailsClick }) => {
    const { user } = useSelector((state) => state.auth);

    const handleAddToCart = async () => {
        if (user == null) {
            toast.error('Будь ласка, увійдіть в систему, щоб додати товар до кошика.', {
                autoClose: 1500,
                closeOnClick: true,
                pauseOnHover: false,
            });
            return;
        }

        try {
            await cartService.addItem(product.id, 1);
            toast.success('Товар успішно додано до кошика!', {
                autoClose: 1500,
                closeOnClick: true,
                pauseOnHover: false
            });
        } catch (err) {
            console.error('Failed to add to cart:', err);
            toast.error('Не вдалося додати товар до кошика.');
        }
    };

    const baseUrl = "https://localhost:7104";

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", maxWidth: 400 }}>
            <CardMedia
                component="img"
                image={
                    product.imagePath && product.imagePath.trim()
                        ? `${baseUrl}${product.imagePath}`
                        : "https://via.placeholder.com/200"
                }
                alt={product.name}
                sx={{
                    height: 300,
                    objectFit: "contain",
                    backgroundColor: "#f5f5f5",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="subtitle1" component="div">
                    {product.name}
                </Typography>
                <Typography variant="h6" color="primary">
                    {product.price} ₴
                </Typography>
            </CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    size="small"
                >
                    {product.stock > 0 ? "Додати до кошика" : "Немає в наявності"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    to={`/products/${product.id}`}
                    size="small"
                >
                    Деталі
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;