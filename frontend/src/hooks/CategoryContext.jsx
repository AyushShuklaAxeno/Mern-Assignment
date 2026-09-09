/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export const CategoryContext = createContext(null);

export const CategoryContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/category');
            if (res.data?.success) {
                setCategories(res.data.data || []);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch categories";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addCategory = async ({ name, description }) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.post('/category', { name, description });
            if (res.data?.success) {
                await fetchCategories();
                return res.data;
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to add category";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.delete('/category', {
                data: { categoryId }
            });
            if (res.data?.success) {
                setCategories(prev => prev.filter(c => c._id !== categoryId));
                return res.data;
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete category";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (categoryId, updatedFields) => {
        try {
            setLoading(true);
            setError(null);
            setCategories(prev =>
                prev.map(cat => (cat._id === categoryId ? { ...cat, ...updatedFields } : cat))
            );
            return { success: true };
        } catch (err) {
            const message = err.message || "Failed to update category";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;
        api.get('/category')
            .then(res => {
                if (!ignore && res.data?.success) {
                    setCategories(res.data.data || []);
                }
            })
            .catch(err => {
                if (!ignore) {
                    setError(err.response?.data?.message || "Failed to fetch categories");
                }
            });
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <CategoryContext.Provider
            value={{
                categories,
                loading,
                error,
                fetchCategories,
                addCategory,
                deleteCategory,
                updateCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategories must be used within a CategoryContextProvider");
    }
    return context;
};
