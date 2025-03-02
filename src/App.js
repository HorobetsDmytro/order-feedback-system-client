import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from "./components/common/Navbar";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProductDetails from "./components/products/ProductDetails";
import OrderList from "./components/orders/OrderList";
import OrderDetails from "./components/orders/OrderDetails";
import CreateOrder from "./components/orders/CreateOrder";
import Cart from "./components/carts/Cart";
import PrivateRoute from "./components/auth/PrivateRoute";
import HomePage from "./components/HomePage";
import ErrorBoundary from "./components/common/ErrorBoundary";
import {ThemeProvider} from "@mui/material";
import theme from './theme';
import AdminProductsPage from "./components/admin/AdminProductsPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminOrdersPage from "./components/admin/AdminOrdersPage";

const App = () => {
  return (
      <ThemeProvider theme={ theme }>
          <Router>
              <ErrorBoundary>
                  <Navbar/>
                  <Routes>
                      <Route path="/" element={ <HomePage/> }/>
                      <Route path="/login" element={ <LoginForm/> }/>
                      <Route path="/register" element={ <RegisterForm/> }/>
                      <Route path="/products" element={ <Navigate to="/" replace/> }/>
                      <Route path="/products/:id" element={ <ProductDetails/> }/>
                      <Route
                          path="/cart"
                          element={
                              <PrivateRoute>
                                  <Cart/>
                              </PrivateRoute>
                          }
                      />
                      <Route
                          path="/checkout"
                          element={
                              <PrivateRoute>
                                  <CreateOrder/>
                              </PrivateRoute>
                          }
                      />
                      <Route
                          path="/orders"
                          element={
                              <PrivateRoute>
                                  <OrderList/>
                              </PrivateRoute>
                          }
                      />
                      <Route
                          path="/orders/:id"
                          element={
                              <PrivateRoute>
                                  <OrderDetails/>
                              </PrivateRoute>
                          }
                      />
                      <Route
                          path="/admin/products"
                          element={
                              <PrivateRoute roles={['Admin']}>
                                  <AdminProductsPage />
                              </PrivateRoute>
                          }
                      />
                      <Route
                          path="/admin/orders"
                          element={
                              <PrivateRoute roles={['Admin']}>
                                  <AdminOrdersPage />
                              </PrivateRoute>
                          }
                      />
                  </Routes>
                  <ToastContainer autoClose={1500} closeOnClick={true} pauseOnHover={false}/>
              </ErrorBoundary>
          </Router>
      </ThemeProvider>
  );
};

export default App;