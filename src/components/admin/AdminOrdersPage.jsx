import React, { useState, useEffect } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ordersService } from '../../services/api';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const STATUS_MAP = {
        0: "В очікуванні",
        1: "В обробці",
        2: "Відправлено",
        3: "Доставлено",
        4: "Скасовано",
    };

    const REVERSE_STATUS_MAP = {
        "В очікуванні": 0,
        "В обробці": 1,
        "Відправлено": 2,
        "Доставлено": 3,
        "Скасовано": 4,
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await ordersService.getAllOrders();
                if (response?.data) {
                    setOrders(response.data);
                } else {
                    setError('Дані від сервера не отримані');
                }
            } catch (err) {
                console.error('Не вдалося завантажити замовлення:', err);
                setError('Не вдалося завантажити замовлення');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const statusValue = REVERSE_STATUS_MAP[newStatus];
            await ordersService.updateStatus(orderId, statusValue);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: statusValue } : order
                )
            );
            toast.success("Статус успішно оновлено!");
        } catch (err) {
            console.error("Не вдалося оновити статус замовлення:", err);
            toast.error("Не вдалося оновити статус!");
        }
    };

    const handleViewDetails = async (order) => {
        try {
            const response = await ordersService.getById(order.id);
            if (response?.data) {
                setSelectedOrder(response.data);
            } else {
                setSelectedOrder({ ...order, orderItems: [] });
            }
        } catch (err) {
            console.error("Не вдалося завантажити деталі замовлення:", err);
            setSelectedOrder({ ...order, orderItems: [] });
        }
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    if (loading) return <div>Завантаження...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Всі замовлення
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Замовлення</TableCell>
                            <TableCell>Користувач</TableCell>
                            <TableCell>Загальна Сума</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user?.username || 'Невідомий користувач'}</TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Select
                                        value={STATUS_MAP[order.status] || "В очікуванні"}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        {Object.values(STATUS_MAP).map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleViewDetails(order)}>Деталі</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={!!selectedOrder} onClose={handleCloseDetails}>
                <DialogTitle>Деталі Замовлення</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography variant="h6">Замовлення #{selectedOrder.id}</Typography>
                            <Typography>Дата: {new Date(selectedOrder.createdAt).toLocaleDateString()}</Typography>
                            <Typography>Загальна Сума: ${selectedOrder.totalAmount.toFixed(2)}</Typography>
                            <Typography>Статус: {STATUS_MAP[selectedOrder.status]}</Typography>
                            <Typography variant="h6" mt={2}>
                                Товари:
                            </Typography>
                            <ul>
                                {Array.isArray(selectedOrder?.orderItems) && selectedOrder.orderItems.length > 0 ? (
                                    selectedOrder.orderItems.map((item) => (
                                        <li key={item.id}>
                                            {item.product?.name || "Невідомий товар"} - Кількість: {item.quantity}, Ціна: $
                                            {item.unitPrice.toFixed(2)}
                                        </li>
                                    ))
                                ) : (
                                    <Typography color="error">Товари відсутні в цьому замовленні</Typography>
                                )}
                            </ul>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Закрити</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminOrdersPage;