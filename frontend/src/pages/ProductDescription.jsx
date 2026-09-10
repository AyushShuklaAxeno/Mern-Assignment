import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/ProductContext';
import Navbar from '../components/Navbar';
import FooterSection from '../components/home/FooterSection';
import ProductBreadcrumb from '../components/product/ProductBreadcrumb';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import ProductReviews from '../components/product/ProductReviews';
import ProductRecommendations from '../components/product/ProductRecommendations';
import ProductNotFound from '../components/product/ProductNotFound';

export const ProductDescription = () => {
    const { id } = useParams();
    const { fetchProductById, products } = useProducts();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('reviews');

    useEffect(() => {
        let isMounted = true;

        const loadProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchProductById(id);
                if (isMounted && data) {
                    setProduct(data);
                }
            } catch (err) {
                if (isMounted) {
                    const fallback = products?.find((p) => p._id === id);
                    if (fallback) {
                        setProduct(fallback);
                    } else {
                        setError(err.message || 'Product not found');
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            loadProduct();
        }

        return () => {
            isMounted = false;
        };
    }, [id, fetchProductById, products]);

    return (
        <div className="product-page">
            <Navbar />

            <div className="product-page-container">
                {loading && !product ? (
                    <div className="product-page__loading-state">
                        <p>Loading product details...</p>
                    </div>
                ) : error && !product ? (
                    <ProductNotFound message={error} />
                ) : (
                    <>
                        <ProductBreadcrumb product={product} />

                        <div className="product-detail__layout">
                            <ProductGallery product={product} />
                            <ProductInfo product={product} />
                        </div>

                        <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                        {activeTab === 'reviews' && <ProductReviews />}

                        {activeTab === 'details' && (
                            <div className="product-page__tab-content">
                                <h3>Product Specifications</h3>
                                <p>
                                    {product?.description || 'Great Quality.'}
                                </p>
                                <ul>
                                    <li>Feel: Soft-touch fabric designed for all-day comfort</li>
                                    <li>Style: Clean everyday look with a modern finish</li>
                                    <li>Durability: Crafted to hold its shape and color over time</li>
                                    <li>Versatility: Easy to pair with any clothes</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'faqs' && (
                            <div className="product-page__tab-content">
                                <h3>Frequently Asked Questions</h3>
                                <div className="product-page__faq-item">
                                    <h4>What is the delivery timeline?</h4>
                                    <p>Standard delivery takes 3-5 business days. Express delivery is available at checkout.</p>
                                </div>
                                <div className="product-page__faq-item">
                                    <h4>What is your return policy?</h4>
                                    <p>We offer hassle-free returns within 30 days of receiving your order.</p>
                                </div>
                                <div>
                                    <h4>How do I choose my size?</h4>
                                    <p>Please refer to our standard size guide. If between sizes, we recommend sizing up for a relaxed fit.</p>
                                </div>
                            </div>
                        )}

                        <ProductRecommendations currentProductId={product?._id} />
                    </>
                )}
            </div>

            <FooterSection />
        </div>
    );
};

export default ProductDescription;
