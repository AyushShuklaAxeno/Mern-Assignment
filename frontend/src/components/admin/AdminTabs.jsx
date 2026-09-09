import { LayoutDashboard, Package, Tag, ShoppingBag } from 'lucide-react';

export const AdminTabs = ({ activeTab, onSelectTab, counts }) => {
    const tabs = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            id: 'products',
            label: 'Products',
            icon: Package,
            count: counts?.products,
        },
        {
            id: 'categories',
            label: 'Categories',
            icon: Tag,
            count: counts?.categories,
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingBag,
            count: counts?.orders,
        },
    ];

    return (
        <nav className="admin-tabs" aria-label="Admin Navigation">
            {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        className={`admin-tabs__tab ${isActive ? 'admin-tabs__tab--active' : ''}`}
                        onClick={() => onSelectTab(tab.id)}
                    >
                        <Icon size={18} className="admin-tabs__icon" />
                        <span className="admin-tabs__label">{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="admin-tabs__count">{tab.count}</span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default AdminTabs;
