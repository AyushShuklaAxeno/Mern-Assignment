/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from "react";
import api from "../lib/api";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    // Rehydrate user session from cookie on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/user');
                if (res.data?.success && res.data?.data) {
                    setUser(res.data.data);
                }
            } catch {
                // Not logged in or session expired
                setUser(null);
            } finally {
                setInitialLoading(false);
            }
        };

        checkAuth();
    }, []);

    const registerUser = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.post('/auth/register', formData);
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Unable to register";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.post('/auth/login', formData);
            const userData = res.data?.data;
            setUser(userData);
            return userData;
        } catch (err) {
            const message = err.response?.data?.message || "Unable to log in";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.put('/user/profile', formData);
            const updatedUser = res.data?.data;
            if (updatedUser) {
                setUser(updatedUser);
            }
            return updatedUser;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update profile";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async (addressData) => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.put('/user/address', addressData);
            const updatedUser = res.data?.data;
            if (updatedUser) {
                setUser(updatedUser);
            }
            return updatedUser;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update address";
            setError(message);
            throw new Error(message, { cause: err });
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                initialLoading,
                error,
                registerUser,
                loginUser,
                logoutUser,
                updateProfile,
                updateAddress,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};