import { Clock, RefreshCw, Truck, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
    placed: {
        label: 'Placed',
        icon: Clock,
        className: 'admin-badge--placed',
    },
    processing: {
        label: 'Processing',
        icon: RefreshCw,
        className: 'admin-badge--processing',
    },
    shipped: {
        label: 'Shipped',
        icon: Truck,
        className: 'admin-badge--shipped',
    },
    delivered: {
        label: 'Delivered',
        icon: CheckCircle2,
        className: 'admin-badge--delivered',
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        className: 'admin-badge--cancelled',
    },
};

export const OrderStatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status?.toLowerCase()] || {
        label: status || 'Unknown',
        icon: Clock,
        className: 'admin-badge--default',
    };

    const Icon = config.icon;

    return (
        <span className={`admin-badge ${config.className}`}>
            <Icon size={13} className="admin-badge__icon" />
            <span>{config.label}</span>
        </span>
    );
};

export default OrderStatusBadge;
