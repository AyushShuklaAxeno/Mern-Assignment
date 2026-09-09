import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';

export const AdminHeader = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    return (
        <header className="admin-header">
            <div className="admin-header__brand">
                <Link to="/admin" className="admin-header__logo">
                    SHOP.CO
                </Link>
                <span className="admin-header__badge">
                    <ShieldCheck size={14} />
                    ADMIN PORTAL
                </span>
            </div>

            <div className="admin-header__actions">
                <Link to="/" className="admin-header__link" title="Visit Public Store">
                    <span>View Store</span>
                    <ExternalLink size={14} />
                </Link>

                <div className="admin-header__user">
                    <div className="admin-header__avatar">
                        <User size={16} />
                    </div>
                    <div className="admin-header__user-info">
                        <span className="admin-header__user-name">{user?.name || 'Administrator'}</span>
                        <span className="admin-header__user-role">{user?.email}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="admin-header__logout"
                    title="Log Out"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
