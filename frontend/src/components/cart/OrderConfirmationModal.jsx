import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X,
    CheckCircle2,
    MapPin,
    CreditCard,
    Banknote,
    Smartphone,
    Building2,
    ArrowRight,
    Edit2,
    Check
} from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import { useCart } from '../../hooks/CartContext';
import api from '../../lib/api';

const PAYMENT_METHODS = [
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'netbanking', label: 'Net Banking', icon: Building2 },
];

export const OrderConfirmationModal = ({
    isOpen,
    onClose,
    deliveryFee = 0,
    discountAmount = 0,
    totalAmount = 0,
}) => {
    const { user } = useAuth();
    const { cartItems, clearCart, cartSubtotal } = useCart();
    const navigate = useNavigate();

    const hasSavedAddress = Boolean(
        user?.address?.street &&
        user?.address?.city &&
        user?.address?.state &&
        user?.address?.zip
    );

    const [isEditingAddress, setIsEditingAddress] = useState(!hasSavedAddress);
    const [shippingAddress, setShippingAddress] = useState({
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        country: user?.address?.country || 'India',
        zip: user?.address?.zip || '',
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [placedOrder, setPlacedOrder] = useState(null);

    useEffect(() => {
        if (user?.address) {
            setShippingAddress({
                street: user.address.street || '',
                city: user.address.city || '',
                state: user.address.state || '',
                country: user.address.country || 'India',
                zip: user.address.zip || '',
            });
            setIsEditingAddress(!Boolean(user.address.street && user.address.city));
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        setError('');

        const { street, city, state, country, zip } = shippingAddress;
        if (!street.trim() || !city.trim() || !state.trim() || !country.trim() || !zip.trim()) {
            setError('Please provide a complete delivery address.');
            setIsEditingAddress(true);
            return;
        }

        try {
            setSubmitting(true);
            const res = await api.post('/order', {
                shippingAddress: {
                    street: street.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    country: country.trim(),
                    zip: zip.trim(),
                },
                paymentMethod,
            });

            if (res.data?.success && res.data?.data) {
                setPlacedOrder(res.data.data);
                await clearCart();
            } else {
                throw new Error(res.data?.message || 'Failed to place order');
            }
        } catch (err) {
            console.error('Order placement failed:', err);
            const message = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoToOrders = () => {
        onClose();
        navigate('/profile');
    };

    const handleContinueShopping = () => {
        onClose();
        navigate('/shop');
    };

    const itemCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

    return (
        <div className="checkout-modal-backdrop" onClick={onClose}>
            <div
                className="checkout-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    type="button"
                    className="checkout-modal__close-btn"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {placedOrder ? (
                    <div className="checkout-modal__success">
                        <div className="checkout-modal__success-icon">
                            <CheckCircle2 size={52} strokeWidth={2} />
                        </div>

                        <h2 className="checkout-modal__success-title">Order Confirmed!</h2>

                        <p className="checkout-modal__success-id">
                            Order #{placedOrder._id ? placedOrder._id.slice(-6).toUpperCase() : ''}
                        </p>

                        <p className="checkout-modal__success-message">
                            Thank you, <strong>{user?.name || 'Customer'}</strong>! We have received your order and started preparing it for delivery.
                        </p>

                        <div className="checkout-modal__success-info">
                            <div className="checkout-modal__info-line">
                                <span>Delivering to</span>
                                <strong>{placedOrder.shippingAddress?.street}, {placedOrder.shippingAddress?.city}</strong>
                            </div>
                            <div className="checkout-modal__info-line">
                                <span>Payment</span>
                                <strong>{placedOrder.paymentMethod?.toUpperCase()}</strong>
                            </div>
                            <div className="checkout-modal__info-line checkout-modal__info-line--total">
                                <span>Total Paid</span>
                                <strong>₹{(placedOrder.totalAmount || totalAmount).toLocaleString()}</strong>
                            </div>
                        </div>

                        <div className="checkout-modal__success-actions">
                            <button
                                type="button"
                                className="button button--primary checkout-modal__action-btn"
                                onClick={handleGoToOrders}
                            >
                                View in My Orders
                                <ArrowRight size={16} />
                            </button>
                            <button
                                type="button"
                                className="checkout-modal__secondary-btn"
                                onClick={handleContinueShopping}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                ) : (

                    <form className="checkout-modal__form" onSubmit={handleConfirmOrder}>
                        <div className="checkout-modal__header">
                            <h2 className="checkout-modal__title">Confirm Order</h2>
                            <p className="checkout-modal__subtitle">
                                Review delivery address and choose payment
                            </p>
                        </div>

                        {error && (
                            <div className="checkout-modal__error-alert">
                                {error}
                            </div>
                        )}

                        <div className="checkout-modal__content">

                            <div className="checkout-modal__section">
                                <div className="checkout-modal__section-head">
                                    <div className="checkout-modal__section-title">
                                        <MapPin size={16} />
                                        <span>Delivery Address</span>
                                    </div>
                                    {!isEditingAddress && (
                                        <button
                                            type="button"
                                            className="checkout-modal__edit-link"
                                            onClick={() => setIsEditingAddress(true)}
                                        >
                                            <Edit2 size={13} />
                                            Change
                                        </button>
                                    )}
                                </div>

                                {!isEditingAddress ? (
                                    <div className="checkout-modal__address-preview">
                                        <p className="checkout-modal__address-recipient">{user?.name}</p>
                                        <p className="checkout-modal__address-text">
                                            {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}
                                        </p>
                                        <span className="checkout-modal__address-country">{shippingAddress.country}</span>
                                    </div>
                                ) : (
                                    <div className="checkout-modal__address-form">
                                        <div className="checkout-modal__field">
                                            <input
                                                id="chkStreet"
                                                name="street"
                                                type="text"
                                                placeholder="Street Address, Flat / House No."
                                                value={shippingAddress.street}
                                                onChange={handleAddressChange}
                                                className="checkout-modal__input"
                                            />
                                        </div>

                                        <div className="checkout-modal__input-row">
                                            <input
                                                id="chkCity"
                                                name="city"
                                                type="text"
                                                placeholder="City"
                                                value={shippingAddress.city}
                                                onChange={handleAddressChange}
                                                className="checkout-modal__input"
                                            />
                                            <input
                                                id="chkState"
                                                name="state"
                                                type="text"
                                                placeholder="State"
                                                value={shippingAddress.state}
                                                onChange={handleAddressChange}
                                                className="checkout-modal__input"
                                            />
                                        </div>

                                        <div className="checkout-modal__input-row">
                                            <input
                                                id="chkZip"
                                                name="zip"
                                                type="text"
                                                placeholder="PIN / Zip Code"
                                                value={shippingAddress.zip}
                                                onChange={handleAddressChange}
                                                className="checkout-modal__input"
                                            />
                                            <input
                                                id="chkCountry"
                                                name="country"
                                                type="text"
                                                placeholder="Country"
                                                value={shippingAddress.country}
                                                onChange={handleAddressChange}
                                                className="checkout-modal__input"
                                            />
                                        </div>

                                        {hasSavedAddress && (
                                            <button
                                                type="button"
                                                className="checkout-modal__cancel-edit"
                                                onClick={() => setIsEditingAddress(false)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="checkout-modal__section">
                                <div className="checkout-modal__section-head">
                                    <div className="checkout-modal__section-title">
                                        <CreditCard size={16} />
                                        <span>Payment Method</span>
                                    </div>
                                </div>

                                <div className="checkout-modal__payment-methods">
                                    {PAYMENT_METHODS.map((pm) => {
                                        const Icon = pm.icon;
                                        const isSelected = paymentMethod === pm.id;
                                        return (
                                            <button
                                                key={pm.id}
                                                type="button"
                                                className={`checkout-modal__pm-pill ${isSelected ? 'checkout-modal__pm-pill--selected' : ''
                                                    }`}
                                                onClick={() => setPaymentMethod(pm.id)}
                                            >
                                                <Icon size={16} />
                                                <span>{pm.label}</span>
                                                {isSelected && <Check size={14} className="checkout-modal__pm-check" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="checkout-modal__summary-card">
                                <div className="checkout-modal__summary-line">
                                    <span>Items ({itemCount})</span>
                                    <span>₹{cartSubtotal.toLocaleString()}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="checkout-modal__summary-line checkout-modal__summary-line--discount">
                                        <span>Discount</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="checkout-modal__summary-line">
                                    <span>Delivery</span>
                                    <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                                </div>
                                <div className="checkout-modal__summary-line checkout-modal__summary-line--total">
                                    <span>Total Amount</span>
                                    <strong>₹{totalAmount.toLocaleString()}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="checkout-modal__footer">
                            <button
                                type="submit"
                                className="button button--primary checkout-modal__submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    'Placing Order...'
                                ) : (
                                    <>
                                        <span>Confirm & Place Order</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OrderConfirmationModal;
