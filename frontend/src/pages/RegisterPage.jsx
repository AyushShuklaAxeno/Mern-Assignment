import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import brandLogo from '../assests/icons/brand_logo.svg';

const RegisterPage = () => {
    const { registerUser, loading, error, clearError } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get('redirect');

    const [showPassword, setShowPassword] = useState(false);
    const [registerFormData, setRegisterFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
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
            await registerUser(registerFormData);
            navigate(redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login');
        } catch {
            // Error handled in context
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
                        <h1 className="auth-card__title">Create Account</h1>
                        {/* <p className="auth-card__subtitle">
                            Join SHOP.CO to get 20% off your first order & fast checkout
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
                        {/* Full Name Field */}
                        <div className="auth-field-group">
                            <label htmlFor="name" className="auth-label">
                                Full Name
                            </label>
                            <div className="auth-input-wrapper">
                                <User size={18} className="auth-input-icon" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="auth-input"
                                    placeholder="e.g. John Doe"
                                    value={registerFormData.name}
                                    onChange={onInputChangeHandler}
                                    autoComplete="name"
                                />
                            </div>
                        </div>

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

                        {/* Phone Number Field */}
                        <div className="auth-field-group">
                            <label htmlFor="phone" className="auth-label">
                                Phone Number
                            </label>
                            <div className="auth-input-wrapper">
                                <Phone size={18} className="auth-input-icon" />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="auth-input"
                                    placeholder="e.g. +91 98765 43210"
                                    value={registerFormData.phone}
                                    onChange={onInputChangeHandler}
                                    autoComplete="tel"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="auth-field-group">
                            <label htmlFor="password" className="auth-label">
                                Password
                            </label>
                            <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="auth-input auth-input--password"
                                    placeholder="Create a strong password"
                                    value={registerFormData.password}
                                    onChange={onInputChangeHandler}
                                    autoComplete="new-password"
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
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </form>

                    {/* Switch to Login */}
                    <div className="auth-card__footer">
                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <Link
                                to={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
                                className="auth-footer-link"
                            >
                                Sign In
                            </Link>
                        </p>

                        {/* <div className="auth-security-badge">
                            <ShieldCheck size={14} />
                            <span>100% Secure & verified registration</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default RegisterPage;
