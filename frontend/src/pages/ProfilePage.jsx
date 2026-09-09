import '../scss/pages/_profile.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import Navbar from '../components/Navbar';
import FooterSection from '../components/home/FooterSection';
import ProfileUserInfo from '../components/profile/ProfileUserInfo';
import ProfileAddress from '../components/profile/ProfileAddress';
import ProfileOrders from '../components/profile/ProfileOrders';

export const ProfilePage = () => {
    const { user, initialLoading, logoutUser } = useAuth();
    const navigate = useNavigate();

    if (initialLoading) {
        return (
            <div className="profile-loading-screen">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    return (
        <div className="profile-page">
            <Navbar />

            <div className="profile-container">
                {/* Header */}
                <div className="profile-header">
                    <div>
                        <h1 className="profile-header__title">My Account</h1>
                        <p className="profile-header__email">{user.email}</p>
                    </div>

                    <button
                        type="button"
                        className="profile-logout-btn"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <span>Sign out</span>
                    </button>
                </div>

                {/* Content Layout */}
                <div className="profile-grid">
                    <div className="profile-grid__sidebar">
                        <ProfileUserInfo />
                        <ProfileAddress />
                    </div>

                    <div className="profile-grid__main">
                        <ProfileOrders />
                    </div>
                </div>
            </div>

            <FooterSection />
        </div>
    );
};

export default ProfilePage;

