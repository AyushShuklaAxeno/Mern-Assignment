import { useState } from 'react';
import { ShoppingBag, Search, Eye, X, MapPin, CreditCard } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

export const AdminOrdersView = ({ orders, loading, onChangeStatus }) => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const statuses = ['all', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'];

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
        const query = searchQuery.toLowerCase();
        const matchesQuery =
            !query ||
            order._id?.toLowerCase().includes(query) ||
            order.user?.toLowerCase().includes(query) ||
            order.shippingAddress?.city?.toLowerCase().includes(query) ||
            order.items?.some(item => item.name?.toLowerCase().includes(query));

        return matchesStatus && matchesQuery;
    });

    const handleStatusChange = async (orderId, newStatus) => {
        if (!newStatus) return;
        try {
            setUpdatingOrderId(orderId);
            await onChangeStatus(orderId, newStatus);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    return (
        <div className="admin-orders-view">
            {/* Filter pills and search */}
            <div className="admin-toolbar admin-toolbar--stacked">
                <div className="admin-filter-pills">
                    {statuses.map(st => {
                        const count =
                            st === 'all'
                                ? orders.length
                                : orders.filter(o => o.orderStatus === st).length;

                        return (
                            <button
                                key={st}
                                type="button"
                                className={`admin-filter-pill ${
                                    statusFilter === st ? 'admin-filter-pill--active' : ''
                                }`}
                                onClick={() => setStatusFilter(st)}
                            >
                                <span>{st.charAt(0).toUpperCase() + st.slice(1)}</span>
                                <span className="admin-filter-pill__count">{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="admin-search">
                    <Search size={18} className="admin-search__icon" />
                    <input
                        type="text"
                        placeholder="Search by order ID, city, or product name..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search__input"
                    />
                </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
                <div className="admin-empty-state">
                    <ShoppingBag size={48} className="admin-empty-state__icon" />
                    <h3>No orders found</h3>
                    <p>
                        {statusFilter !== 'all'
                            ? `No orders currently in "${statusFilter}" status.`
                            : searchQuery
                            ? `No orders match "${searchQuery}".`
                            : 'No customer orders have been placed yet.'}
                    </p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID & Date</th>
                                <th>Items Ordered</th>
                                <th>Shipping To</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Order Status</th>
                                <th className="admin-table__actions-heading">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => {
                                const isUpdating = updatingOrderId === order._id;

                                return (
                                    <tr key={order._id}>
                                        <td>
                                            <div className="admin-order-id-cell">
                                                <span className="admin-order-id">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                                <span className="admin-order-date">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString(
                                                              'en-IN',
                                                              {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  year: 'numeric',
                                                              }
                                                          )
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-order-items-snippet">
                                                {order.items?.slice(0, 2).map((item, i) => (
                                                    <div key={i} className="admin-order-item-line">
                                                        <span className="admin-order-item-line__name">
                                                            {item.name}
                                                        </span>
                                                        <span className="admin-order-item-line__meta">
                                                            ({item.size?.toUpperCase()}) × {item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <span className="admin-order-items-snippet__more">
                                                        +{order.items.length - 2} more item(s)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-address-cell">
                                                <span>
                                                    {order.shippingAddress?.city},{' '}
                                                    {order.shippingAddress?.state}
                                                </span>
                                                <span className="admin-address-cell__zip">
                                                    {order.shippingAddress?.zip}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="admin-table__price">
                                                ₹{order.totalAmount?.toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="admin-badge admin-badge--payment">
                                                {order.paymentMethod?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-status-changer">
                                                <select
                                                    className="admin-status-select"
                                                    value={order.orderStatus}
                                                    onChange={e =>
                                                        handleStatusChange(order._id, e.target.value)
                                                    }
                                                    disabled={isUpdating || loading}
                                                >
                                                    <option value="placed">Placed</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <OrderStatusBadge status={order.orderStatus} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-actions-cell">
                                                <button
                                                    type="button"
                                                    className="admin-action-btn"
                                                    title="View Full Order Details"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="admin-modal admin-modal--md"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <div>
                                <h3>Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
                                <p className="admin-modal__subtext">
                                    Placed on{' '}
                                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                                        dateStyle: 'full',
                                    })}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="admin-modal__close"
                                onClick={() => setSelectedOrder(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="admin-order-detail-content">
                            {/* Status Change Section */}
                            <div className="admin-order-detail-card">
                                <div className="admin-order-detail-card__header">
                                    <h4>Order Status</h4>
                                    <OrderStatusBadge status={selectedOrder.orderStatus} />
                                </div>
                                <div className="admin-order-detail-status-row">
                                    <label>Change Status to:</label>
                                    <select
                                        className="admin-form__select"
                                        value={selectedOrder.orderStatus}
                                        onChange={async e => {
                                            const newStatus = e.target.value;
                                            await handleStatusChange(selectedOrder._id, newStatus);
                                            setSelectedOrder(prev => ({
                                                ...prev,
                                                orderStatus: newStatus,
                                            }));
                                        }}
                                    >
                                        <option value="placed">Placed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="admin-order-detail-card">
                                <h4>
                                    <MapPin size={16} /> Delivery Address
                                </h4>
                                <p className="admin-order-address-text">
                                    {selectedOrder.shippingAddress?.street}, <br />
                                    {selectedOrder.shippingAddress?.city},{' '}
                                    {selectedOrder.shippingAddress?.state} -{' '}
                                    {selectedOrder.shippingAddress?.zip}
                                    <br />
                                    {selectedOrder.shippingAddress?.country}
                                </p>
                            </div>

                            {/* Items List */}
                            <div className="admin-order-detail-card">
                                <h4>Ordered Items ({selectedOrder.items?.length})</h4>
                                <div className="admin-order-items-table">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="admin-order-item-row">
                                            <div className="admin-order-item-row__info">
                                                <strong>{item.name}</strong>
                                                <span>
                                                    Size: {item.size?.toUpperCase()} | Qty: {item.quantity}
                                                </span>
                                            </div>
                                            <div className="admin-order-item-row__price">
                                                ₹{(item.priceAtTimeOfPurchase || item.priceAtTimeOf || 0) * item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="admin-order-summary-row">
                                <span>Payment Method:</span>
                                <strong>
                                    <CreditCard size={15} /> {selectedOrder.paymentMethod?.toUpperCase()}
                                </strong>
                            </div>
                            <div className="admin-order-summary-row admin-order-summary-row--total">
                                <span>Total Amount Paid:</span>
                                <strong>₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</strong>
                            </div>
                        </div>

                        <div className="admin-modal__footer">
                            <button
                                type="button"
                                className="admin-btn admin-btn--primary"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersView;
