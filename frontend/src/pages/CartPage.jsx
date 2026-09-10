import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterSection from '../components/home/FooterSection';
import { useCart } from '../hooks/CartContext';
import { useAuth } from '../hooks/AuthContext';
import OrderConfirmationModal from '../components/cart/OrderConfirmationModal';

import chevronRightIcon from '../assests/icons/chevron_right.svg';
import rightArrowWhiteIcon from '../assests/icons/right-arrow-big-white.svg';
import trashIcon from '../assests/icons/trash_icon.svg';

const CartPage = () => {
    const navigate = useNavigate();
    const { user, initialLoading } = useAuth();
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, cartSubtotal } = useCart();

    const [promoCode, setPromoCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    if (initialLoading) {
        return (
            <div className="cart-page">
                <Navbar />
                <div className="cart-page-container cart-loading-state">
                    <p>Loading cart...</p>
                </div>
                <FooterSection />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login?redirect=/cart" replace />;
    }

    const deliveryFee = cartSubtotal > 0 ? (cartSubtotal >= 1000 ? 0 : 100) : 0;
    const discountAmount = Math.round(cartSubtotal * (discountPercent / 100));
    const totalAmount = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

    const handleApplyPromo = () => {
        const trimmed = promoCode.trim().toUpperCase();
        if (!trimmed) {
            setPromoError('Please enter a promo code');
            return;
        }

        if (trimmed === 'SAVE20' || trimmed === 'DISCOUNT20') {
            setDiscountPercent(20);
            setPromoError('');
        } else if (trimmed === 'SAVE10') {
            setDiscountPercent(10);
            setPromoError('');
        } else {
            setPromoError('Invalid promo code. Try "SAVE20"');
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (!user) {
            navigate('/login?redirect=/cart');
            return;
        }
        setShowCheckoutModal(true);
    };

    return (
        <div className="cart-page">
            <Navbar />

            <div className="cart-page-container">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <ul className="breadcrumb__list">
                        <li className="breadcrumb__item">
                            <Link to="/" className="breadcrumb__link">
                                Home
                            </Link>
                            <img src={chevronRightIcon} alt="chevron_right" />
                        </li>
                        <li className="breadcrumb__item breadcrumb__item--current" aria-current="page">
                            Cart
                        </li>
                    </ul>
                </nav>

                <section className="cart">
                    <h1 className="cart__title">YOUR CART</h1>

                    <div className="cart__layout">
                        <ul className="cart__items">
                            {cartItems.length === 0 ? (
                                <li className="cart__empty-state">
                                    <p className="cart__empty-title">
                                        Your cart is empty
                                    </p>
                                    <p className="cart__empty-description">
                                        Add some items to your cart to see them here.
                                    </p>
                                    <Link
                                        to="/"
                                        className="button button--primary cart__empty-action"
                                    >
                                        Explore Products
                                    </Link>
                                </li>
                            ) : (
                                cartItems.map((item) => (
                                    <li
                                        key={`${item.productId}-${item.size}-${item.color || ''}`}
                                        className="cart-item"
                                    >
                                        <img
                                            src={item.thumbnailImage || '/assests/images/placeholder.png'}
                                            alt={item.name}
                                            className="cart-item__image"
                                        />

                                        <div className="cart-item__content">
                                            <div className="cart-item__top">
                                                <div className="cart-item__details">
                                                    <h3 className="cart-item__name">{item.name}</h3>
                                                    <p className="cart-item__meta">
                                                        Size: <span className="cart-item__meta-value">{item.size}</span>
                                                    </p>
                                                    {item.color && (
                                                        <p className="cart-item__meta">
                                                            Color: <span className="cart-item__meta-value">{item.color}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    className="cart-item__remove"
                                                    aria-label={`Remove ${item.name} from cart`}
                                                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                                >
                                                    <img
                                                        src={trashIcon}
                                                        alt="Remove"
                                                        className="cart-item__remove-icon"
                                                    />
                                                </button>
                                            </div>

                                            <div className="cart-item__bottom">
                                                <p className="cart-item__price">₹{Number(item.price) || 0}</p>

                                                <div className="quantity-selector">
                                                    <button
                                                        type="button"
                                                        className="quantity-selector__button quantity-selector__button--decrease"
                                                        aria-label="Decrease quantity"
                                                        onClick={() => decreaseQuantity(item.productId, item.size, item.color)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity-selector__value">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        className="quantity-selector__button quantity-selector__button--increase"
                                                        aria-label="Increase quantity"
                                                        disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                                                        title={item.maxStock !== undefined && item.quantity >= item.maxStock ? `Maximum stock reached (${item.maxStock})` : 'Increase quantity'}
                                                        onClick={() => increaseQuantity(item.productId, item.size, item.color)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>

                        <aside className="order-summary">
                            <h2 className="order-summary__title">Order Summary</h2>

                            <div className="order-summary__row">
                                <span className="order-summary__label">Subtotal</span>
                                <span className="order-summary__value order-summary__subtotal">
                                    ₹{cartSubtotal}
                                </span>
                            </div>

                            {discountPercent > 0 && (
                                <div className="order-summary__row order-summary__discount-row">
                                    <span className="order-summary__label">
                                        Discount (-<span className="order-summary__discount-percent">{discountPercent}</span>%)
                                    </span>
                                    <span className="order-summary__value order-summary__value--discount order-summary__discount-amount">
                                        -₹{discountAmount}
                                    </span>
                                </div>
                            )}

                            <div className="order-summary__row">
                                <span className="order-summary__label">Delivery Fee</span>
                                <span className="order-summary__value order-summary__delivery">
                                    {cartSubtotal === 0 ? '₹0' : deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                                </span>
                            </div>

                            <hr className="order-summary__divider" />

                            <div className="order-summary__row order-summary__row--total">
                                <span className="order-summary__label">Total</span>
                                <span className="order-summary__value order-summary__total">
                                    ₹{totalAmount}
                                </span>
                            </div>

                            <div className="order-summary__promo">
                                <input
                                    type="text"
                                    placeholder="Add promo code"
                                    className="order-summary__promo-input"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleApplyPromo();
                                    }}
                                />
                                <button
                                    type="button"
                                    className="order-summary__promo-button"
                                    onClick={handleApplyPromo}
                                >
                                    Apply
                                </button>
                            </div>
                            {promoError && <p className="order-summary__promo-error">{promoError}</p>}

                            <button
                                type="button"
                                className="order-summary__checkout"
                                disabled={cartItems.length === 0}
                                onClick={handleCheckout}
                            >
                                Go to Checkout
                                <img src={rightArrowWhiteIcon} alt="" />
                            </button>
                        </aside>
                    </div>
                </section>
            </div>

            <FooterSection />

            <OrderConfirmationModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                deliveryFee={deliveryFee}
                discountAmount={discountAmount}
                totalAmount={totalAmount}
            />
        </div>
    );
};

export default CartPage;
