import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user, initialLoading } = useAuth();
    const location = useLocation();

    if (initialLoading) {
        return (
            <div className="route-loading-state">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
