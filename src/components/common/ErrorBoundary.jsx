import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Помилка:', error);
        console.error('Інформація про помилку:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h5" color="error">
                        Щось пішло не так.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Перезавантажити сторінку
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;