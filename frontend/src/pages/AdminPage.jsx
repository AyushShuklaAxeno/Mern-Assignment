import { useState, useEffect } from 'react';
import { useAdminProducts } from '../hooks/AdminProductContext';
import { useCategories } from '../hooks/CategoryContext';
import { useOrders } from '../hooks/OrderContext';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabs from '../components/admin/AdminTabs';
import AdminDashboardView from '../components/admin/AdminDashboardView';
import AdminProductsView from '../components/admin/AdminProductsView';
import AdminCategoriesView from '../components/admin/AdminCategoriesView';
import AdminOrdersView from '../components/admin/AdminOrdersView';
import AddProductModal from '../components/admin/AddProductModal';
import EditProductModal from '../components/admin/EditProductModal';
import AddCategoryModal from '../components/admin/AddCategoryModal';
import EditCategoryModal from '../components/admin/EditCategoryModal';
import AdminToast from '../components/admin/AdminToast';

export const AdminPage = () => {
    const {
        products,
        loading: productsLoading,
        addProduct,
        deleteProduct,
        updateProduct,
    } = useAdminProducts();

    const {
        categories,
        loading: categoriesLoading,
        addCategory,
        deleteCategory,
        updateCategory,
    } = useCategories();

    const {
        orders,
        loading: ordersLoading,
        fetchAdminOrders,
        changeOrderStatus,
    } = useOrders();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [toast, setToast] = useState(null);

    // Fetch admin orders on mount
    useEffect(() => {
        fetchAdminOrders();
    }, [fetchAdminOrders]);

    const showToast = (type, message) => {
        setToast({ type, message });
    };

    // Product handlers
    const handleAddProduct = async (formData) => {
        try {
            await addProduct(formData);
            showToast('success', 'Product published successfully!');
        } catch (err) {
            showToast('error', err.message || 'Failed to add product');
            throw err;
        }
    };

    const handleUpdateProduct = async (productId, updatedFields) => {
        try {
            await updateProduct(productId, updatedFields);
            showToast('success', 'Product updated successfully!');
        } catch (err) {
            showToast('error', err.message || 'Failed to update product');
            throw err;
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProduct(productId);
            showToast('success', 'Product deleted from store.');
        } catch (err) {
            showToast('error', err.message || 'Failed to delete product');
        }
    };

    // Category handlers
    const handleAddCategory = async (categoryData) => {
        try {
            await addCategory(categoryData);
            showToast('success', `Category "${categoryData.name}" created!`);
        } catch (err) {
            showToast('error', err.message || 'Failed to create category');
            throw err;
        }
    };

    const handleUpdateCategory = async (categoryId, updatedFields) => {
        try {
            await updateCategory(categoryId, updatedFields);
            showToast('success', 'Category updated successfully!');
        } catch (err) {
            showToast('error', err.message || 'Failed to update category');
            throw err;
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            showToast('success', 'Category removed successfully.');
        } catch (err) {
            showToast('error', err.message || 'Failed to delete category');
        }
    };

    // Order handlers
    const handleChangeOrderStatus = async (orderId, newStatus) => {
        try {
            await changeOrderStatus(orderId, newStatus);
            showToast('success', `Order #${orderId.slice(-6).toUpperCase()} status changed to "${newStatus}".`);
        } catch (err) {
            showToast('error', err.message || 'Failed to update order status');
        }
    };

    const counts = {
        products: products.length,
        categories: categories.length,
        orders: orders.length,
    };

    return (
        <div className="admin-page">
            <AdminToast toast={toast} onClose={() => setToast(null)} />

            <AdminHeader />

            <div className="admin-container">
                <div className="admin-container__header">
                    <div>
                        <h1 className="admin-container__title">Admin Control Center</h1>
                        <p className="admin-container__subtitle">
                            Manage your ShopCo catalog, categories, and customer orders
                        </p>
                    </div>

                    <AdminTabs
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                        counts={counts}
                    />
                </div>

                <main className="admin-container__content">
                    {activeTab === 'dashboard' && (
                        <AdminDashboardView
                            products={products}
                            categories={categories}
                            orders={orders}
                            onNavigateTab={setActiveTab}
                            onOpenAddProduct={() => setIsAddProductOpen(true)}
                            onOpenAddCategory={() => setIsAddCategoryOpen(true)}
                        />
                    )}

                    {activeTab === 'products' && (
                        <AdminProductsView
                            products={products}
                            categories={categories}
                            loading={productsLoading}
                            onOpenAddProduct={() => setIsAddProductOpen(true)}
                            onOpenEditProduct={product => setEditingProduct(product)}
                            onDeleteProduct={handleDeleteProduct}
                        />
                    )}

                    {activeTab === 'categories' && (
                        <AdminCategoriesView
                            categories={categories}
                            products={products}
                            loading={categoriesLoading}
                            onOpenAddCategory={() => setIsAddCategoryOpen(true)}
                            onOpenEditCategory={category => setEditingCategory(category)}
                            onDeleteCategory={handleDeleteCategory}
                        />
                    )}

                    {activeTab === 'orders' && (
                        <AdminOrdersView
                            orders={orders}
                            loading={ordersLoading}
                            onChangeStatus={handleChangeOrderStatus}
                        />
                    )}
                </main>
            </div>

            {/* Modals */}
            <AddProductModal
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onAddProduct={handleAddProduct}
                categories={categories}
            />

            <EditProductModal
                isOpen={Boolean(editingProduct)}
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onUpdateProduct={handleUpdateProduct}
                categories={categories}
            />

            <AddCategoryModal
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                onAddCategory={handleAddCategory}
            />

            <EditCategoryModal
                isOpen={Boolean(editingCategory)}
                category={editingCategory}
                onClose={() => setEditingCategory(null)}
                onUpdateCategory={handleUpdateCategory}
            />
        </div>
    );
};

export default AdminPage;
