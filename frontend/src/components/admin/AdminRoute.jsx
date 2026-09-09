import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const AdminRoute = ({ children }) => {
    const { user, initialLoading } = useAuth();

    if (initialLoading) {
        return (
            <div className="admin-loading-screen">
                <div className="admin-spinner" />
                <p>Verifying admin privileges...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return (
            <div className="admin-unauthorized">
                <div className="admin-unauthorized__card">
                    <ShieldAlert size={48} className="admin-unauthorized__icon" />
                    <h2>Access Denied</h2>
                    <p>You do not have administrator permissions to access this dashboard.</p>
                    <div className="admin-unauthorized__actions">
                        <Link to="/" className="button button--primary">
                            Return to Store
                        </Link>
                        <Link to="/login" className="button button--secondary">
                            Log In as Admin
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminRoute;
