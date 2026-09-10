import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import brandLogo from '../assests/icons/brand_logo.svg';

const LoginPage = () => {
    const { loginUser, loading, error, clearError } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get('redirect');

    const [showPassword, setShowPassword] = useState(false);
    const [registerFormData, setRegisterFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        clearError();
        return () => clearError();
    }, []);

    const onInputChangeHandler = (e) => {
        if (error) clearError();
        const { name, value } = e.target;
        setRegisterFormData((prev) => ({ ...prev, [name]: value.trim() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loggedInUser = await loginUser(registerFormData);
            if (redirectUrl) {
                navigate(redirectUrl);
            } else if (loggedInUser?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch {
            // Error is handled in context
        }
    };

    return (
        <main className="auth">
            <div className="auth-container">
                {/* Back to Home Link */}
                <div className="auth-top-nav">
                    <Link to="/" className="auth-back-link">
                        <ArrowLeft size={16} />
                        <span>Back to Store</span>
                    </Link>
                </div>

                <div className="auth-card">
                    {/* Brand Header */}
                    <div className="auth-card__brand">
                        <Link to="/">
                            <img src={brandLogo} alt="SHOP.CO" className="auth-card__logo" />
                        </Link>
                    </div>

                    <div className="auth-card__header">
                        <h1 className="auth-card__title">Welcome Back</h1>
                        {/* <p className="auth-card__subtitle">
                            Sign in to access your cart, orders, and saved wishlist
                        </p> */}
                    </div>

                    {/* Alert Banner on Error */}
                    {error && (
                        <div className="auth-alert auth-alert--error" role="alert">
                            <AlertCircle size={18} className="auth-alert__icon" />
                            <span className="auth-alert__text">{error}</span>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="auth-field-group">
                            <label htmlFor="email" className="auth-label">
                                Email Address
                            </label>
                            <div className="auth-input-wrapper">
                                <Mail size={18} className="auth-input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="auth-input"
                                    placeholder="name@example.com"
                                    value={registerFormData.email}
                                    onChange={onInputChangeHandler}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="auth-field-group">
                            <div className="auth-label-row">
                                <label htmlFor="password" className="auth-label">
                                    Password
                                </label>
                            </div>
                            <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="auth-input auth-input--password"
                                    placeholder="Enter your password"
                                    value={registerFormData.password}
                                    onChange={onInputChangeHandler}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="auth-spinner" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Switch to Register */}
                    <div className="auth-card__footer">
                        <p className="auth-footer-text">
                            Don't have an account?{' '}
                            <Link
                                to={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'}
                                className="auth-footer-link"
                            >
                                Create an account
                            </Link>
                        </p>

                        {/* <div className="auth-security-badge">
                            <ShieldCheck size={14} />
                            <span>Encrypted & secure checkout connection</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
