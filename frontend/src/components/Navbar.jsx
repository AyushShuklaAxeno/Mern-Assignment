import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { useCart } from '../hooks/CartContext';
import { useProducts } from '../hooks/ProductContext';
import brandLogo from '../assests/icons/brand_logo.svg';
import searchIcon from '../assests/icons/search_icon.svg';
import blackSearchIcon from '../assests/icons/black_search_icon.svg';
import cartIcon from '../assests/icons/cart_icon.svg';
import profileIcon from '../assests/icons/profile_icon.svg';
import cancelIcon from '../assests/icons/cancel_icon.svg';
import hamburgerIcon from '../assests/icons/hamburger_icon.svg';
import chevronDownIcon from '../assests/icons/chevron_down_icon.svg';

export const Navbar = () => {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const { fetchProducts } = useProducts();
    const navigate = useNavigate();
    const [showOffer, setShowOffer] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleSearch = async (event) => {
        event.preventDefault();

        const search = searchQuery.trim();
        if (!search) {
            navigate('/shop');
            return;
        }

        await fetchProducts({
            page: 1,
            search,
            category: '',
            minPrice: '',
            maxPrice: '',
            size: '',
            dressStyle: '',
            sort: 'newest',
        });

        navigate(`/shop?search=${encodeURIComponent(search)}`);
    };

    return (
        <header className="navbar">
            {showOffer && (
                <div className="navbar__offer">
                    <div />
                    <p>
                        Sign up and get 20% off to your first order.{' '}
                        <Link to="/register" className="navbar__offer-highlight">
                            Sign Up Now
                        </Link>
                    </p>
                    <img
                        src={cancelIcon}
                        alt="Close offer"
                        className="navbar__offer-cancel"
                        onClick={() => setShowOffer(false)}
                    />
                </div>
            )}

            <div className="navbar__container">
                <div className="navbar__group">
                    <button
                        type="button"
                        className={`navbar__menu ${isMobileMenuOpen ? 'navbar__menu--open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        <img src={hamburgerIcon} alt="" />
                    </button>
                    <Link to="/" className="navbar__brand-link">
                        <img src={brandLogo} alt="SHOP.CO" className="navbar__brand-logo" />
                    </Link>
                </div>

                <ul className="navbar__links">
                    <li className="navbar__links-item">
                        <Link to="/shop" className="navbar__links-link">
                            Shop <img src={chevronDownIcon} alt="" className="navbar__links-icon" />
                        </Link>
                    </li>

                    <li className="navbar__links-item">
                        <a href="#on-sale" className="navbar__links-link">
                            On Sale
                        </a>
                    </li>

                    <li className="navbar__links-item">
                        <a href="#new-arrivals" className="navbar__links-link">
                            New Arrivals
                        </a>
                    </li>

                    <li className="navbar__links-item">
                        <a href="#brands" className="navbar__links-link">
                            Brands
                        </a>
                    </li>

                    {user?.role === 'admin' && (
                        <li className="navbar__links-item">
                            <Link to="/admin" className="navbar__links-link navbar__links-link--admin">
                                Go to Admin
                            </Link>
                        </li>
                    )}
                </ul>

                <form className="navbar__search" onSubmit={handleSearch}>
                    <img src={searchIcon} alt="Search" className="navbar__search-icon" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="navbar__search-input"
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                        aria-label="Search products"
                    />
                </form>

                <div className="navbar__group">
                    <a href="#search" className="navbar__cart-profile__search" aria-label="Search">
                        <img src={blackSearchIcon} alt="Search" />
                    </a>
                    <Link to="/cart" aria-label="Cart" className="navbar__cart-link">
                        <img src={cartIcon} alt="Cart" />
                        {cartCount > 0 && (
                            <span className="navbar__cart-count">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        to={user ? '/profile' : '/login'}
                        className="navbar__profile-link"
                        aria-label="Profile"
                        title={user ? `${user.name} - View Profile` : 'Login'}
                    >
                        <img src={profileIcon} alt="Profile" />
                    </Link>
                </div>
            </div>

            {isMobileMenuOpen && (
                <>
                    <button
                        type="button"
                        className="navbar__mobile-menu-backdrop"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    />
                    <nav className="navbar__mobile-menu" aria-label="Mobile Navigation">
                        <Link to="/shop" className="navbar__mobile-menu-link" onClick={closeMobileMenu}>
                            Shop
                            <img src={chevronDownIcon} alt="" />
                        </Link>
                        <a href="#on-sale" className="navbar__mobile-menu-link" onClick={closeMobileMenu}>
                            On Sale
                        </a>
                        <a href="#new-arrivals" className="navbar__mobile-menu-link" onClick={closeMobileMenu}>
                            New Arrivals
                        </a>
                        <a href="#brands" className="navbar__mobile-menu-link" onClick={closeMobileMenu}>
                            Brands
                        </a>
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="navbar__mobile-menu-link navbar__mobile-menu-link--admin"
                                onClick={closeMobileMenu}
                            >
                                Go to Admin
                            </Link>
                        )}
                    </nav>
                </>
            )}
        </header>
    );
};

export default Navbar;
