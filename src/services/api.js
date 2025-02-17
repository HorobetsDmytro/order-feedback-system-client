import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7104/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getCurrentUser: () => api.get('/auth/current')
};

export const productsService = {
    getAll: (filters) => api.get('/products', { params: filters }),
    getById: (id) => api.get(`/products/${id}`),
    create: (product) => api.post('/products', product),
    update: (id, product) => api.put(`/products/${id}`, product),
    delete: (id) => api.delete(`/products/${id}`),
    updateStock: (id, quantity) => api.post(`/products/${id}/stock`, { quantity }),
};

export const ordersService = {
    create: (orderItems) => api.post('/orders', orderItems),
    getById: (id) => api.get(`/orders/${id}`),
    getUserOrders: () => api.get('/orders/user'),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, status)
};

export const cartService = {
    getCart: () => api.get('/cart'),
    addItem: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
    updateQuantity: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),
    removeItem: (productId) => api.delete(`/cart/items/${productId}`)
};

export const reviewsService = {
    create: (reviewData) => api.post('/reviews', reviewData),
    update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
    getOrderReviews: (orderId) => api.get(`/reviews/order/${orderId}`),
    getFilteredReviews: (rating) => api.get(`/reviews/filter?rating=${rating}`),
    getProductRating: (productId) => api.get(`/reviews/product/${productId}/rating`)
};