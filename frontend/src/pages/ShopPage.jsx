import '../scss/pages/_shop.scss';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/ProductContext';
import Navbar from '../components/Navbar';
import FooterSection from '../components/home/FooterSection';
import ProductCard from '../components/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import ShopHeader from '../components/shop/ShopHeader';
import ShopPagination from '../components/shop/ShopPagination';

import chevronRightIcon from '../assests/icons/chevron_right.svg';

const formatTitle = (text) => {
    if (!text) return '';
    return text
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const ShopPage = () => {
    const { products, loading, appliedFilters, applyFilters } = useProducts();
    const [searchParams] = useSearchParams();
    const { categoryName } = useParams();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Sync URL search params and category route param into product filter context
    useEffect(() => {
        const catParam = searchParams.get('category') || categoryName || '';
        const styleParam =
            searchParams.get('dressStyle') ||
            searchParams.get('dressstyle') ||
            searchParams.get('dress_style') ||
            searchParams.get('style') ||
            '';

        const normalizedCat = catParam.toLowerCase().trim();
        const normalizedStyle = styleParam.toLowerCase().trim();

        const updates = {};
        let needsUpdate = false;

        if (normalizedCat !== appliedFilters.category) {
            updates.category = normalizedCat;
            needsUpdate = true;
        }
        if (normalizedStyle !== appliedFilters.dressStyle) {
            updates.dressStyle = normalizedStyle;
            needsUpdate = true;
        }

        if (needsUpdate) {
            applyFilters(updates);
        }
    }, [searchParams, categoryName]);

    // Close mobile filter on viewport resize > 992px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setIsMobileFilterOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent background scrolling while mobile filter drawer is open
    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileFilterOpen]);

    const paramStyle =
        searchParams.get('dressStyle') ||
        searchParams.get('dressstyle') ||
        searchParams.get('dress_style') ||
        searchParams.get('style') ||
        '';
    const paramCategory = searchParams.get('category') || categoryName || '';

    const effectiveStyle = paramStyle || appliedFilters.dressStyle || '';
    const effectiveCategory = paramCategory || appliedFilters.category || '';

    const activeTitle = effectiveStyle
        ? formatTitle(effectiveStyle)
        : effectiveCategory
        ? formatTitle(effectiveCategory)
        : 'Casual';

    return (
        <div className="shop-page">
            <Navbar />

            <div className="shop-page-container">
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <ul className="breadcrumb__list">
                        <li className="breadcrumb__item">
                            <Link to="/" className="breadcrumb__link">
                                Home
                            </Link>
                            <img src={chevronRightIcon} alt="" />
                        </li>
                        <li className="breadcrumb__item breadcrumb__item--current" aria-current="page">
                            {activeTitle}
                        </li>
                    </ul>
                </nav>

                <div className="shop-layout">
                    <div className="shop-layout__sidebar">
                        <ShopFilters />
                    </div>

                    <main className="shop-layout__content">
                        <ShopHeader
                            title={activeTitle}
                            onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
                        />

                        {loading ? (
                            <div className="shop-loading">
                                <p>Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="shop-empty">
                                <h3>No Products Found</h3>
                                <p>Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        ) : (
                            <ul className="shop-grid">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        price={product.price}
                                        discountPrice={product.discountPrice}
                                        discountPercentage={product.discountPercentage}
                                        imgURL={product.thumbnailImage}
                                        rating={product.rating || 4.5}
                                    />
                                ))}
                            </ul>
                        )}

                        <hr className="shop-divider" />

                        <ShopPagination />
                    </main>
                </div>
            </div>

            {isMobileFilterOpen && (
                <div
                    className="shop-mobile-drawer-backdrop"
                    onClick={() => setIsMobileFilterOpen(false)}
                >
                    <div
                        className="shop-mobile-drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ShopFilters
                            isMobile
                            onClose={() => setIsMobileFilterOpen(false)}
                        />
                    </div>
                </div>
            )}

            <FooterSection />
        </div>
    );
};

export default ShopPage;
