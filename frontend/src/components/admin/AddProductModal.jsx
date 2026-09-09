import { useState } from 'react';
import { X, Plus, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose, onAddProduct, categories }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [variants, setVariants] = useState([
        { size: 'Small', quantity: 10 },
        { size: 'Medium', quantity: 15 },
        { size: 'Large', quantity: 10 },
    ]);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    if (!isOpen) return null;

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

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 5) {
            setFormError('You can upload a maximum of 5 gallery images');
            return;
        }
        setGalleryFiles(files);
        setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
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
        if (!thumbnailFile) return setFormError('Thumbnail image is required');
        if (galleryFiles.length === 0) return setFormError('At least one gallery image is required');
        if (variants.length === 0) return setFormError('At least one variant size/quantity is required');

        for (const v of variants) {
            if (!v.size?.trim()) return setFormError('Every variant must have a size specified');
            if (v.quantity < 0) return setFormError('Variant quantities must be 0 or higher');
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('price', String(price));
            if (discountPrice && Number(discountPrice) > 0) {
                formData.append('discountPrice', String(discountPrice));
            }
            if (discountPercentage && Number(discountPercentage) > 0) {
                formData.append('discountPercentage', String(discountPercentage));
            }
            formData.append('categories', JSON.stringify(selectedCategories));
            formData.append(
                'variants',
                JSON.stringify(
                    variants.map(v => ({
                        size: v.size.toLowerCase().trim(),
                        quantity: Number(v.quantity),
                    }))
                )
            );
            formData.append('thumbnailImage', thumbnailFile);
            galleryFiles.forEach(file => {
                formData.append('galleryImages', file);
            });

            await onAddProduct(formData);
            onClose();
        } catch (err) {
            setFormError(err.message || 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
                <div className="admin-modal__header">
                    <h3>Add New Product</h3>
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
                            placeholder="e.g. Slim Fit Denim Shirt"
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
                                placeholder="e.g. 499"
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
                                placeholder="e.g. 399 (Optional)"
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
                                placeholder="e.g. 20 (Optional)"
                                value={discountPercentage}
                                onChange={e => handleDiscountPercentageChange(e.target.value)}
                                min="0"
                                max="99"
                            />
                        </div>
                    </div>

                    <div className="admin-form__field">
                        <label className="admin-form__label">Description *</label>
                        <textarea
                            className="admin-form__textarea"
                            rows={3}
                            placeholder="Detailed product features, material, and fit details..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="admin-form__field">
                        <label className="admin-form__label">Assign Categories *</label>
                        {categories.length === 0 ? (
                            <p className="admin-form__hint">No categories exist yet. Please create a category first.</p>
                        ) : (
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
                        )}
                    </div>

                    {/* Variants Builder */}
                    <div className="admin-form__field">
                        <div className="admin-form__label-row">
                            <label className="admin-form__label">Variants (Size & Stock Quantity) *</label>
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

                    {/* Image Uploads */}
                    <div className="admin-form__row">
                        <div className="admin-form__field">
                            <label className="admin-form__label">Main Thumbnail Image *</label>
                            <div className="admin-file-box">
                                {thumbnailPreview ? (
                                    <div className="admin-file-preview">
                                        <img src={thumbnailPreview} alt="Thumbnail preview" />
                                        <label className="admin-file-replace-btn">
                                            Change
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailChange}
                                                className="admin-file-input"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="admin-file-dropzone">
                                        <UploadCloud size={28} />
                                        <span>Click to upload main thumbnail</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="admin-file-input"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="admin-form__field">
                            <label className="admin-form__label">Gallery Images (1-5 images) *</label>
                            <div className="admin-file-box">
                                {galleryPreviews.length > 0 ? (
                                    <div className="admin-gallery-previews">
                                        {galleryPreviews.map((preview, i) => (
                                            <img key={i} src={preview} alt={`Gallery preview ${i}`} />
                                        ))}
                                        <label className="admin-file-replace-btn">
                                            Replace
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleGalleryChange}
                                                className="admin-file-input"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="admin-file-dropzone">
                                        <ImageIcon size={28} />
                                        <span>Click to upload up to 5 gallery shots</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className="admin-file-input"
                                        />
                                    </label>
                                )}
                            </div>
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
                            {submitting ? 'Uploading to Cloudinary...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
