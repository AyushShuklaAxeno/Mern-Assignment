/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/api";

export const OrderContext = createContext(null);

export const OrderContextProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all orders (Admin only: GET /api/v1/order/admin)
    const fetchAdminOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/order/admin');
            if (res.data?.success) {
                setOrders(res.data.data || []);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch orders";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch customer's own orders (GET /api/v1/order/my-orders)
    const fetchMyOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/order/my-orders');
            if (res.data?.success) {
                setMyOrders(res.data.data || []);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch your orders";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Change status of an order (Admin only: PATCH /api/v1/order/change-status/:order_id)
    const changeOrderStatus = async (orderId, orderStatus) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.patch(`/order/change-status/${orderId}`, {
                order_status: orderStatus,
            });

            if (res.data?.success && res.data?.data) {
                const updatedOrder = res.data.data;
                setOrders(prev =>
                    prev.map(ord => (ord._id === orderId ? updatedOrder : ord))
                );
                return updatedOrder;
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update order status";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                myOrders,
                loading,
                error,
                fetchAdminOrders,
                fetchMyOrders,
                changeOrderStatus,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrders must be used within an OrderContextProvider");
    }
    return context;
};
