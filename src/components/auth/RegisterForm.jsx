import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Помилка реєстрації');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Реєстрація
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Ім'я користувача"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                        Зареєструватися
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default RegisterForm;