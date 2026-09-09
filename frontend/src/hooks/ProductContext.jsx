/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export const ProductContext = createContext(null);

const DEFAULT_FILTERS = {
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    dressStyle: '',
    sort: 'popular',
};

export const ProductContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 9,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async (customParams = {}) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: customParams.page ?? currentPage,
                limit: customParams.limit ?? 9,
                sort: customParams.sort ?? appliedFilters.sort,
                ...(appliedFilters.category ? { category: appliedFilters.category } : {}),
                ...(appliedFilters.minPrice ? { minPrice: appliedFilters.minPrice } : {}),
                ...(appliedFilters.maxPrice ? { maxPrice: appliedFilters.maxPrice } : {}),
                ...(appliedFilters.size ? { size: appliedFilters.size } : {}),
                ...(appliedFilters.dressStyle ? { dressStyle: appliedFilters.dressStyle } : {}),
                ...customParams,
            };

            const res = await api.get('/products', { params });
            if (res.data?.success) {
                const responseData = res.data.data;
                if (Array.isArray(responseData)) {
                    setProducts(responseData);
                    setPagination(prev => ({
                        ...prev,
                        totalProducts: responseData.length,
                        totalPages: Math.ceil(responseData.length / 9) || 1,
                    }));
                } else {
                    setProducts(responseData.products || []);
                    if (responseData.pagination) {
                        setPagination(responseData.pagination);
                    }
                }
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch products";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [currentPage, appliedFilters]);

    const fetchProductById = useCallback(async (id) => {
        try {
            const res = await api.get(`/products/${id}`);
            return res.data?.data;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch product";
            throw new Error(message, { cause: err });
        }
    }, []);

    const setFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const applyFilters = (customFilters) => {
        setCurrentPage(1);
        if (customFilters) {
            setFilters(prev => ({ ...prev, ...customFilters }));
            setAppliedFilters(prev => ({ ...prev, ...customFilters }));
        } else {
            setAppliedFilters({ ...filters });
        }
    };

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        setCurrentPage(1);
    };

    const setSort = (sortValue) => {
        setFilters(prev => ({ ...prev, sort: sortValue }));
        setAppliedFilters(prev => ({ ...prev, sort: sortValue }));
        setCurrentPage(1);
    };

    const setPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <ProductContext.Provider
            value={{
                products,
                pagination,
                loading,
                error,
                filters,
                appliedFilters,
                currentPage,
                setFilter,
                applyFilters,
                resetFilters,
                setSort,
                setPage,
                fetchProducts,
                fetchProductById,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductContextProvider");
    }
    return context;
};

export default ProductContext;
