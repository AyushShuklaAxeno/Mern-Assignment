import { IndianRupee, ShoppingBag, Package, Tag, Plus, ArrowRight } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

export const AdminDashboardView = ({
    products,
    categories,
    orders,
    onNavigateTab,
    onOpenAddProduct,
    onOpenAddCategory,
}) => {
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const totalStock = products.reduce((acc, p) => {
        const variantsSum = p.variants?.reduce((vAcc, v) => vAcc + (v.quantity || 0), 0) || 0;
        return acc + variantsSum;
    }, 0);

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    return (
        <div className="admin-dashboard">
            {/* KPI Cards Grid */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--green">
                        <IndianRupee size={22} />
                    </div>
                    <div className="admin-stat-card__info">
                        <span className="admin-stat-card__label">Total Revenue</span>
                        <h3 className="admin-stat-card__value">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                        <span className="admin-stat-card__hint">From {orders.length} total orders</span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--blue">
                        <ShoppingBag size={22} />
                    </div>
                    <div className="admin-stat-card__info">
                        <span className="admin-stat-card__label">Total Orders</span>
                        <h3 className="admin-stat-card__value">{orders.length}</h3>
                        <span className="admin-stat-card__hint">
                            {orders.filter(o => o.orderStatus === 'placed').length} awaiting processing
                        </span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--purple">
                        <Package size={22} />
                    </div>
                    <div className="admin-stat-card__info">
                        <span className="admin-stat-card__label">Products in Catalog</span>
                        <h3 className="admin-stat-card__value">{products.length}</h3>
                        <span className="admin-stat-card__hint">{totalStock} total units in stock</span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--amber">
                        <Tag size={22} />
                    </div>
                    <div className="admin-stat-card__info">
                        <span className="admin-stat-card__label">Active Categories</span>
                        <h3 className="admin-stat-card__value">{categories.length}</h3>
                        <span className="admin-stat-card__hint">Available on store navigation</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="admin-quick-actions">
                <span className="admin-quick-actions__title">Quick Management Actions:</span>
                <div className="admin-quick-actions__buttons">
                    <button
                        type="button"
                        className="admin-btn admin-btn--primary"
                        onClick={onOpenAddProduct}
                    >
                        <Plus size={16} />
                        <span>Add New Product</span>
                    </button>
                    <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={onOpenAddCategory}
                    >
                        <Plus size={16} />
                        <span>Add New Category</span>
                    </button>
                    <button
                        type="button"
                        className="admin-btn admin-btn--outline"
                        onClick={() => onNavigateTab('orders')}
                    >
                        <span>View All Orders</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="admin-section-card">
                <div className="admin-section-card__header">
                    <div>
                        <h3 className="admin-section-card__title">Recent Orders</h3>
                        <p className="admin-section-card__subtitle">Latest orders placed by customers</p>
                    </div>
                    <button
                        type="button"
                        className="admin-link-btn"
                        onClick={() => onNavigateTab('orders')}
                    >
                        View all orders ({orders.length}) →
                    </button>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="admin-empty-state">
                        <ShoppingBag size={40} className="admin-empty-state__icon" />
                        <p>No customer orders placed yet.</p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td className="admin-table__id">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td>
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                  })
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <span className="admin-table__item-count">
                                                {order.items?.length || 0} item(s)
                                            </span>
                                        </td>
                                        <td className="admin-table__price">
                                            ₹{order.totalAmount?.toLocaleString('en-IN')}
                                        </td>
                                        <td>
                                            <span className="admin-badge admin-badge--payment">
                                                {order.paymentMethod?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <OrderStatusBadge status={order.orderStatus} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardView;
