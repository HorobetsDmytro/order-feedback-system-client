import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Cart from './components/cart/Cart';
import CreateOrder from './components/orders/CreateOrder';
import OrderList from './components/orders/OrderList';
import OrderDetails from './components/orders/OrderDetails';

const App = () => {
  return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <CreateOrder />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <OrderList />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="/orders/:id"
                  element={
                    <PrivateRoute>
                      <OrderDetails />
                    </PrivateRoute>
                  }
              />
              <Route path="/" element={<ProductList />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
};

export default App;