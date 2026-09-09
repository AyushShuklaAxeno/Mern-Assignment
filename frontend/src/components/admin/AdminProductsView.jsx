import { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Package } from 'lucide-react';

export const AdminProductsView = ({
    products,
    categories,
    loading,
    onOpenAddProduct,
    onOpenEditProduct,
    onDeleteProduct,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat._id] = cat.name;
        return acc;
    }, {});

    const filteredProducts = products.filter(p => {
        const query = searchQuery.toLowerCase();
        return (
            p.name?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        );
    });

    const handleDelete = async (productId) => {
        await onDeleteProduct(productId);
        setDeleteConfirmId(null);
    };

    return (
        <div className="admin-products-view">
            {/* Header / Actions bar */}
            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} className="admin-search__icon" />
                    <input
                        type="text"
                        placeholder="Search products by title or description..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search__input"
                    />
                </div>

                <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    onClick={onOpenAddProduct}
                >
                    <Plus size={16} />
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Products Table */}
            {filteredProducts.length === 0 ? (
                <div className="admin-empty-state">
                    <Package size={48} className="admin-empty-state__icon" />
                    <h3>No products found</h3>
                    <p>
                        {searchQuery
                            ? `No products matching "${searchQuery}"`
                            : 'Your store has no products yet. Add your first product to get started.'}
                    </p>
                    {!searchQuery && (
                        <button
                            type="button"
                            className="admin-btn admin-btn--primary"
                            onClick={onOpenAddProduct}
                        >
                            <Plus size={16} />
                            <span>Add First Product</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Categories</th>
                                <th>Price</th>
                                <th>Sizes & Stock</th>
                                <th>Status</th>
                                <th className="admin-table__actions-heading">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const isDeleting = deleteConfirmId === product._id;

                                return (
                                    <tr key={product._id}>
                                        <td>
                                            <div className="admin-product-cell">
                                                <img
                                                    src={product.thumbnailImage}
                                                    alt={product.name}
                                                    className="admin-product-cell__img"
                                                    onError={e => {
                                                        e.target.src = 'https://placehold.co/80x80/f0f0f0/999999?text=No+Img';
                                                    }}
                                                />
                                                <div className="admin-product-cell__info">
                                                    <h4 className="admin-product-cell__title">
                                                        {product.name}
                                                    </h4>
                                                    <p className="admin-product-cell__desc">
                                                        {product.description?.slice(0, 60)}
                                                        {product.description?.length > 60 ? '...' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-tag-list">
                                                {product.category?.map(catId => (
                                                    <span key={catId} className="admin-tag">
                                                        {categoryMap[catId] || 'Category'}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="admin-table__price">
                                                ₹{(product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price ? product.discountPrice : product.price)?.toLocaleString('en-IN')}
                                            </span>
                                            {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (
                                                <div className="admin-table__original-price">
                                                    ₹{product.price?.toLocaleString('en-IN')}
                                                    {product.discountPercentage ? ` (-${product.discountPercentage}%)` : ''}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="admin-variant-list">
                                                {product.variants?.map((variant, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`admin-variant-pill ${
                                                            variant.quantity === 0
                                                                ? 'admin-variant-pill--out'
                                                                : ''
                                                        }`}
                                                    >
                                                        <strong>{variant.size?.toUpperCase()}</strong>: {variant.quantity}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`admin-badge ${
                                                    product.status === 'active'
                                                        ? 'admin-badge--active'
                                                        : 'admin-badge--inactive'
                                                }`}
                                            >
                                                {product.status || 'active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions-cell">
                                                {isDeleting ? (
                                                    <div className="admin-confirm-box">
                                                        <span>Delete?</span>
                                                        <button
                                                            type="button"
                                                            className="admin-btn-tiny admin-btn-tiny--danger"
                                                            onClick={() => handleDelete(product._id)}
                                                            disabled={loading}
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-btn-tiny"
                                                            onClick={() => setDeleteConfirmId(null)}
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="admin-action-btn"
                                                            title="Edit Product"
                                                            onClick={() => onOpenEditProduct(product)}
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-action-btn admin-action-btn--delete"
                                                            title="Delete Product"
                                                            onClick={() => setDeleteConfirmId(product._id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminProductsView;
