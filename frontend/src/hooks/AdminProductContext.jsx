/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export const AdminProductContext = createContext(null);

export const AdminProductContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/products?all=true');
            if (res.data?.success) {
                const items = Array.isArray(res.data.data)
                    ? res.data.data
                    : res.data.data?.products || [];
                setProducts(items);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch admin products";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data?.success && res.data?.data) {
                setProducts(prev => [res.data.data, ...prev]);
                return res.data.data;
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to create product";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete('/products', {
                data: { productId },
            });
            setProducts(prev => prev.filter(p => p._id !== productId));
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete product";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (productId, updatedFields) => {
        try {
            setLoading(true);
            setError(null);
            setProducts(prev =>
                prev.map(prod => (prod._id === productId ? { ...prod, ...updatedFields } : prod))
            );
            return { success: true };
        } catch (err) {
            const message = err.message || "Failed to update product";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <AdminProductContext.Provider
            value={{
                products,
                loading,
                error,
                fetchProducts,
                addProduct,
                deleteProduct,
                updateProduct,
            }}
        >
            {children}
        </AdminProductContext.Provider>
    );
};

export const useAdminProducts = () => {
    const context = useContext(AdminProductContext);
    if (!context) {
        throw new Error("useAdminProducts must be used within an AdminProductContextProvider");
    }
    return context;
};

export default AdminProductContext;
