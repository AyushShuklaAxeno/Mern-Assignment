import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export const EditProductModal = ({ isOpen, onClose, product, onUpdateProduct, categories }) => {
    if (!isOpen || !product) return null;

    return (
        <EditProductForm
            onClose={onClose}
            product={product}
            onUpdateProduct={onUpdateProduct}
            categories={categories}
        />
    );
};

const EditProductForm = ({ onClose, product, onUpdateProduct, categories }) => {
    const [name, setName] = useState(product.name || '');
    const [description, setDescription] = useState(product.description || '');
    const [price, setPrice] = useState(product.price !== undefined ? String(product.price) : '');
    const [discountPrice, setDiscountPrice] = useState(
        product.discountPrice !== undefined && product.discountPrice > 0 ? String(product.discountPrice) : ''
    );
    const [discountPercentage, setDiscountPercentage] = useState(
        product.discountPercentage !== undefined && product.discountPercentage > 0
            ? String(product.discountPercentage)
            : ''
    );
    const [rating, setRating] = useState(String(product.rating || 4.5));
    const [selectedCategories, setSelectedCategories] = useState(product.category || []);
    const [variants, setVariants] = useState(
        product.variants?.length
            ? product.variants.map(v => ({ size: v.size, quantity: v.quantity }))
            : [{ size: 'Medium', quantity: 10 }]
    );
    const [status, setStatus] = useState(product.status || 'active');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleCategoryToggle = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handleAddVariant = () => {
        setVariants(prev => [...prev, { size: '', quantity: 0 }]);
    };

    const handleUpdateVariant = (index, field, value) => {
        setVariants(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: field === 'quantity' ? Number(value) : value };
            return next;
        });
    };

    const handleRemoveVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleDiscountPercentageChange = (val) => {
        setDiscountPercentage(val);
        const numPercent = Number(val);
        const numPrice = Number(price);
        if (numPercent > 0 && numPercent < 100 && numPrice > 0) {
            setDiscountPrice(String(Math.round(numPrice * (1 - numPercent / 100))));
        } else if (!val) {
            setDiscountPrice('');
        }
    };

    const handleDiscountPriceChange = (val) => {
        setDiscountPrice(val);
        const numDisc = Number(val);
        const numPrice = Number(price);
        if (numDisc > 0 && numDisc < numPrice && numPrice > 0) {
            setDiscountPercentage(String(Math.round(((numPrice - numDisc) / numPrice) * 100)));
        } else if (!val) {
            setDiscountPercentage('');
        }
    };

    const handlePriceChange = (val) => {
        setPrice(val);
        const numPrice = Number(val);
        const numPercent = Number(discountPercentage);
        if (numPercent > 0 && numPercent < 100 && numPrice > 0) {
            setDiscountPrice(String(Math.round(numPrice * (1 - numPercent / 100))));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) return setFormError('Product title is required');
        if (!description.trim()) return setFormError('Description is required');
        if (!price || Number(price) < 0) return setFormError('Valid price is required');
        if (discountPrice && Number(discountPrice) >= Number(price)) {
            return setFormError('Discount price must be less than regular price');
        }
        if (selectedCategories.length === 0) return setFormError('Select at least one category');
        if (variants.length === 0) return setFormError('At least one variant size/quantity is required');

        try {
            setSubmitting(true);
            const updatedFields = {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                discountPrice: discountPrice ? Number(discountPrice) : 0,
                discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
                rating: Number(rating),
                category: selectedCategories,
                variants: variants.map(v => ({
                    size: v.size.toLowerCase().trim(),
                    quantity: Number(v.quantity),
                })),
                status,
            };

            await onUpdateProduct(product._id, updatedFields);
            onClose();
        } catch (err) {
            setFormError(err.message || 'Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
                <div className="admin-modal__header">
                    <div>
                        <h3>Edit Product</h3>
                        <p className="admin-modal__subtext">Update product attributes, stock, and status</p>
                    </div>
                    <button type="button" className="admin-modal__close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form className="admin-form" onSubmit={handleSubmit}>
                    {formError && <div className="admin-form__alert">{formError}</div>}

                    <div className="admin-form__field">
                        <label className="admin-form__label">Product Title *</label>
                        <input
                            type="text"
                            className="admin-form__input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="admin-form__row">
                        <div className="admin-form__field">
                            <label className="admin-form__label">Price (₹) *</label>
                            <input
                                type="number"
                                className="admin-form__input"
                                value={price}
                                onChange={e => handlePriceChange(e.target.value)}
                                min="0"
                            />
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Discount Price (₹)</label>
                            <input
                                type="number"
                                className="admin-form__input"
                                placeholder="Optional"
                                value={discountPrice}
                                onChange={e => handleDiscountPriceChange(e.target.value)}
                                min="0"
                            />
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Discount (%)</label>
                            <input
                                type="number"
                                className="admin-form__input"
                                placeholder="Optional"
                                value={discountPercentage}
                                onChange={e => handleDiscountPercentageChange(e.target.value)}
                                min="0"
                                max="99"
                            />
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label" htmlFor="edit-product-rating">Rating</label>
                            <select
                                id="edit-product-rating"
                                className="admin-form__select"
                                value={rating}
                                onChange={e => setRating(e.target.value)}
                            >
                                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(value => (
                                    <option key={value} value={value}>{value} / 5 stars</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="admin-form__field">
                        <label className="admin-form__label">Description *</label>
                        <textarea
                            className="admin-form__textarea"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Status & Categories */}
                    <div className="admin-form__row">
                        <div className="admin-form__field">
                            <label className="admin-form__label">Product Status</label>
                            <select
                                className="admin-form__select"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value="active">Active (Visible in store)</option>
                                <option value="inactive">Inactive (Hidden)</option>
                            </select>
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Categories *</label>
                            <div className="admin-checkbox-group">
                                {categories.map(cat => {
                                    const isSelected = selectedCategories.includes(cat._id);
                                    return (
                                        <label
                                            key={cat._id}
                                            className={`admin-category-pill ${
                                                isSelected ? 'admin-category-pill--selected' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleCategoryToggle(cat._id)}
                                            />
                                            <span>{cat.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Variants Builder */}
                    <div className="admin-form__field">
                        <div className="admin-form__label-row">
                            <label className="admin-form__label">Sizes & Stock Quantities *</label>
                            <button
                                type="button"
                                className="admin-btn-link"
                                onClick={handleAddVariant}
                            >
                                <Plus size={14} /> Add Variant
                            </button>
                        </div>

                        <div className="admin-variant-builder">
                            {variants.map((v, i) => (
                                <div key={i} className="admin-variant-row">
                                    <input
                                        type="text"
                                        className="admin-form__input admin-form__input--sm"
                                        placeholder="Size (e.g. Small, Medium, Large, X-Large)"
                                        value={v.size}
                                        onChange={e => handleUpdateVariant(i, 'size', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        className="admin-form__input admin-form__input--sm"
                                        placeholder="Quantity"
                                        value={v.quantity}
                                        onChange={e => handleUpdateVariant(i, 'quantity', e.target.value)}
                                        min="0"
                                    />
                                    <button
                                        type="button"
                                        className="admin-action-btn admin-action-btn--delete"
                                        onClick={() => handleRemoveVariant(i)}
                                        disabled={variants.length === 1}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
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
                            {submitting ? 'Saving Changes...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
