import './scss/main.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/admin/AdminRoute';
import { AuthContextProvider } from './hooks/AuthContext';
import { ProductContextProvider } from './hooks/ProductContext';
import { AdminProductContextProvider } from './hooks/AdminProductContext';
import { CategoryContextProvider } from './hooks/CategoryContext';
import { OrderContextProvider } from './hooks/OrderContext';
import { CartContextProvider } from './hooks/CartContext';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDescription from './pages/ProductDescription';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthContextProvider>
      <AdminProductContextProvider>
        <ProductContextProvider>
          <CategoryContextProvider>
            <OrderContextProvider>
              <CartContextProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/category/:categoryName" element={<ShopPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/product/:id" element={<ProductDescription />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </CartContextProvider>
            </OrderContextProvider>
          </CategoryContextProvider>
        </ProductContextProvider>
      </AdminProductContextProvider>
    </AuthContextProvider>
  );
}

export default App;
