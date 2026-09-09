import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useProducts } from '../hooks/ProductContext';
import Navbar from '../components/Navbar';
import HeroSection from '../components/home/HeroSection';
import BrandsStrip from '../components/home/BrandsStrip';
import ProductSection from '../components/home/ProductSection';
import DressStyleSection from '../components/home/DressStyleSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FooterSection from '../components/home/FooterSection';

export const HomePage = () => {
    const navigate = useNavigate();
    const { products, loading: productsLoading } = useProducts();
    const [newArrivals, setNewArrivals] = useState([]);
    const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);

    useEffect(() => {
        let ignore = false;

        const fetchNewArrivals = async () => {
            try {
                setLoadingNewArrivals(true);
                const res = await api.get('/products/new-arrivals?limit=4');
                if (!ignore && res.data?.success) {
                    setNewArrivals(res.data.data || []);
                }
            } catch {
                if (!ignore && products?.length > 0) {
                    setNewArrivals(products.slice(0, 4));
                }
            } finally {
                if (!ignore) {
                    setLoadingNewArrivals(false);
                }
            }
        };

        fetchNewArrivals();

        return () => {
            ignore = true;
        };
    }, [products]);

    // Top selling products
    const topSelling = products.slice(0, 4);

    const scrollToProducts = () => {
        const el = document.getElementById('new-arrivals');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="home-page">
            <Navbar />

            <HeroSection onShopNow={scrollToProducts} />

            <BrandsStrip />

            <div id="new-arrivals">
                <ProductSection
                    title="NEW ARRIVALS"
                    products={newArrivals}
                    loading={loadingNewArrivals}
                    onViewAll={() => navigate('/shop')}
                />
            </div>

            <hr className="section-separator" />

            <div id="top-selling">
                <ProductSection
                    title="TOP SELLING"
                    products={topSelling}
                    loading={productsLoading}
                    containerClassName="top-selling"
                    onViewAll={() => navigate('/shop')}
                />
            </div>

            <DressStyleSection />

            <TestimonialsSection />

            <FooterSection />
        </div>
    );
};

export default HomePage;