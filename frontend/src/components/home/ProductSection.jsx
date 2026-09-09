import ProductCard from '../ProductCard';

export const ProductSection = ({
    title,
    products = [],
    loading = false,
    onViewAll,
    containerClassName = '',
}) => {
    return (
        <section className="product-section">
            <h2 className="product-section__heading">{title}</h2>

            {loading ? (
                <div className="product-section__state">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div className="product-section__state">
                    No products currently available in this section.
                </div>
            ) : (
                <ul className={`products-container ${containerClassName}`}>
                    {products.map(product => (
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

            <button
                type="button"
                className="button button--secondary"
                onClick={onViewAll}
            >
                View All
            </button>
        </section>
    );
};

export default ProductSection;
