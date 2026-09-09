import { useState } from 'react';
import { X } from 'lucide-react';

export const EditCategoryModal = ({ isOpen, onClose, category, onUpdateCategory }) => {
    if (!isOpen || !category) return null;

    return (
        <EditCategoryForm
            category={category}
            onClose={onClose}
            onUpdateCategory={onUpdateCategory}
        />
    );
};

const EditCategoryForm = ({ category, onClose, onUpdateCategory }) => {
    const [name, setName] = useState(category.name || '');
    const [description, setDescription] = useState(category.description || '');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) {
            return setFormError('Category name is required');
        }

        try {
            setSubmitting(true);
            await onUpdateCategory(category._id, {
                name: name.trim().toLowerCase(),
                description: description.trim(),
            });
            onClose();
        } catch (err) {
            setFormError(err.message || 'Failed to update category');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
                <div className="admin-modal__header">
                    <h3>Change Category Details</h3>
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
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="admin-form__field">
                        <label className="admin-form__label">Description</label>
                        <textarea
                            className="admin-form__textarea"
                            rows={3}
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
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;
