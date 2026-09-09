import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useOrders } from '../../hooks/OrderContext';

export const ProfileOrders = () => {
    const { myOrders, loading, error, fetchMyOrders } = useOrders();

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const getStatusClass = (status) => {
        const normalized = (status || 'placed').toLowerCase();
        switch (normalized) {
            case 'delivered':
                return 'profile-status--delivered';
            case 'shipped':
                return 'profile-status--shipped';
            case 'processing':
                return 'profile-status--processing';
            case 'cancelled':
                return 'profile-status--cancelled';
            default:
                return 'profile-status--placed';
        }
    };

    return (
        <section className="profile-card">
            <div className="profile-card__header">
                <h2 className="profile-card__title">Orders</h2>
            </div>

            {loading && (!myOrders || myOrders.length === 0) ? (
                <div className="profile-state-text">
                    <p>Loading orders...</p>
                </div>
            ) : error ? (
                <div className="profile-msg profile-msg--error">
                    {error}
                </div>
            ) : !myOrders || myOrders.length === 0 ? (
                <div className="profile-orders-empty">
                    <p>No orders yet</p>
                    <Link to="/shop" className="profile-btn-dark">
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div className="profile-orders-list">
                    {myOrders.map((order) => {
                        const items = order.items || [];
                        const shortId = order._id ? order._id.slice(-6).toUpperCase() : 'UNKNOWN';

                        return (
                            <div key={order._id} className="profile-order-item-card">
                                <div className="profile-order-item-card__header">
                                    <div>
                                        <span className="profile-order-item-card__id">#{shortId}</span>
                                        <span className="profile-order-item-card__date">
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                    <span className={`profile-status ${getStatusClass(order.orderStatus)}`}>
                                        {order.orderStatus || 'Placed'}
                                    </span>
                                </div>

                                <div className="profile-order-item-card__items">
                                    {items.map((item, index) => {
                                        const productImg =
                                            item.product?.thumbnailImage ||
                                            (Array.isArray(item.product?.galleryImages) && item.product.galleryImages[0]);

                                        return (
                                            <div
                                                key={item._id || `${order._id}-item-${index}`}
                                                className="profile-product-row"
                                            >
                                                <div className="profile-product-row__thumb">
                                                    {productImg ? (
                                                        <img
                                                            src={productImg}
                                                            alt={item.name}
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <Package size={18} strokeWidth={1.5} />
                                                    )}
                                                </div>

                                                <div className="profile-product-row__details">
                                                    <p className="profile-product-row__name">
                                                        {item.name || item.product?.name || 'Product'}
                                                    </p>
                                                    <p className="profile-product-row__meta">
                                                        <span>Size: {item.size?.toUpperCase()}</span>
                                                        <span>Qty: {item.quantity}</span>
                                                    </p>
                                                </div>

                                                <div className="profile-product-row__price">
                                                    ₹{(item.priceAtTimeOfPurchase * item.quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="profile-order-item-card__footer">
                                    <span className="profile-order-item-card__dest">
                                        {order.shippingAddress?.city ? `Delivering to ${order.shippingAddress.city}` : ''}
                                    </span>
                                    <div className="profile-order-item-card__total">
                                        <span>Total:</span>
                                        <strong>₹{(order.totalAmount || 0).toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default ProfileOrders;

