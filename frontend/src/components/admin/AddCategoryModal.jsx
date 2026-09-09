import { useState } from 'react';
import { X } from 'lucide-react';

export const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) {
            return setFormError('Category name is required');
        }

        try {
            setSubmitting(true);
            await onAddCategory({
                name: name.trim().toLowerCase(),
                description: description.trim(),
            });
            setName('');
            setDescription('');
            onClose();
        } catch (err) {
            setFormError(err.message || 'Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
                <div className="admin-modal__header">
                    <h3>Add New Category</h3>
                    <button type="button" className="admin-modal__close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="admin-form" onSubmit={handleSubmit}>
                    {formError && <div className="admin-form__alert">{formError}</div>}

                    <div className="admin-form__field">
                        <label className="admin-form__label">Category Name *</label>
                        <input
                            type="text"
                            className="admin-form__input"
                            placeholder="e.g. jackets, hoodies, shoes"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="admin-form__field">
                        <label className="admin-form__label">Description</label>
                        <textarea
                            className="admin-form__textarea"
                            rows={3}
                            placeholder="Brief summary of items in this category..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="admin-modal__footer">
                        <button
                            type="button"
                            className="admin-btn admin-btn--secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn admin-btn--primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;
