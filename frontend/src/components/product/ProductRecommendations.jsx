import { useProducts } from '../../hooks/ProductContext';
import ProductCard from '../ProductCard';

export const ProductRecommendations = ({ currentProductId }) => {
    const { products } = useProducts();

    const recommendations = (products || [])
        .filter((p) => p._id !== currentProductId)
        .slice(0, 4);

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <section className="product-section">
            <h2 className="product-section__heading">YOU MIGHT ALSO LIKE THIS</h2>
            <ul className="products-container might-like">
                {recommendations.map((p) => (
                    <ProductCard
                        key={p._id}
                        id={p._id}
                        imgURL={p.thumbnailImage}
                        rating={4.5}
                        name={p.name}
                        price={p.price}
                        discountPrice={p.discountPrice}
                        discountPercentage={p.discountPercentage}
                    />
                ))}
            </ul>
        </section>
    );
};

export default ProductRecommendations;
