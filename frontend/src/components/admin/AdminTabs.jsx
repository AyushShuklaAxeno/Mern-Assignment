import { LayoutDashboard, Package, Tag, ShoppingBag } from 'lucide-react';

export const AdminTabs = ({ activeTab, onSelectTab }) => {
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
        },
        {
            id: 'categories',
            label: 'Categories',
            icon: Tag,
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingBag,
        },
    ];

    return (
        <nav className="admin-tabs admin-tabs--sidebar" aria-label="Admin Navigation">
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
                    </button>
                );
            })}
        </nav>
    );
};

export default AdminTabs;
