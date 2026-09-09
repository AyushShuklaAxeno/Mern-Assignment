import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const AdminToast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const isError = toast.type === 'error';

    return (
        <div className={`admin-toast ${isError ? 'admin-toast--error' : 'admin-toast--success'}`}>
            <div className="admin-toast__icon">
                {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div className="admin-toast__message">{toast.message}</div>
            <button
                type="button"
                className="admin-toast__close"
                onClick={onClose}
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default AdminToast;
