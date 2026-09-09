import { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Tag, AlertCircle } from 'lucide-react';

export const AdminCategoriesView = ({
    categories,
    products,
    loading,
    onOpenAddCategory,
    onOpenEditCategory,
    onDeleteCategory,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Compute products count for each category
    const getProductCount = (categoryId) => {
        return products.filter(p => p.category?.includes(categoryId)).length;
    };

    const filteredCategories = categories.filter(cat => {
        const query = searchQuery.toLowerCase();
        return (
            cat.name?.toLowerCase().includes(query) ||
            cat.description?.toLowerCase().includes(query)
        );
    });

    const handleDelete = async (categoryId) => {
        await onDeleteCategory(categoryId);
        setDeleteConfirmId(null);
    };

    return (
        <div className="admin-categories-view">
            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} className="admin-search__icon" />
                    <input
                        type="text"
                        placeholder="Search categories by name or description..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search__input"
                    />
                </div>

                <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    onClick={onOpenAddCategory}
                >
                    <Plus size={16} />
                    <span>Add New Category</span>
                </button>
            </div>

            {/* Notice about deletion constraints */}
            <div className="admin-info-banner">
                <AlertCircle size={18} className="admin-info-banner__icon" />
                <span>
                    Categories with assigned products cannot be removed directly. You must reassign or remove the products first.
                </span>
            </div>

            {/* Categories Table */}
            {filteredCategories.length === 0 ? (
                <div className="admin-empty-state">
                    <Tag size={48} className="admin-empty-state__icon" />
                    <h3>No categories found</h3>
                    <p>
                        {searchQuery
                            ? `No categories matching "${searchQuery}"`
                            : 'No categories created yet. Create a category to organize your products.'}
                    </p>
                    {!searchQuery && (
                        <button
                            type="button"
                            className="admin-btn admin-btn--primary"
                            onClick={onOpenAddCategory}
                        >
                            <Plus size={16} />
                            <span>Add First Category</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Assigned Products</th>
                                <th className="admin-table__actions-heading">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map(cat => {
                                const prodCount = getProductCount(cat._id);
                                const isDeleting = deleteConfirmId === cat._id;

                                return (
                                    <tr key={cat._id}>
                                        <td>
                                            <div className="admin-category-name-cell">
                                                <div className="admin-category-icon-box">
                                                    <Tag size={16} />
                                                </div>
                                                <span className="admin-category-title">
                                                    {cat.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="admin-category-desc">
                                                {cat.description || 'No description provided.'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="admin-badge admin-badge--count">
                                                {prodCount} product{prodCount === 1 ? '' : 's'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions-cell">
                                                {isDeleting ? (
                                                    <div className="admin-confirm-box">
                                                        <span>Confirm?</span>
                                                        <button
                                                            type="button"
                                                            className="admin-btn-tiny admin-btn-tiny--danger"
                                                            onClick={() => handleDelete(cat._id)}
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
                                                            title="Change Category"
                                                            onClick={() => onOpenEditCategory(cat)}
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-action-btn admin-action-btn--delete"
                                                            title="Remove Category"
                                                            onClick={() => setDeleteConfirmId(cat._id)}
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

export default AdminCategoriesView;
