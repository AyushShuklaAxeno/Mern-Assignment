import { Link } from 'react-router-dom';
import chevronRightIcon from '../../assests/icons/chevron_right.svg';
import ProductRecommendations from './ProductRecommendations';

export const ProductNotFound = () => {
    return (
        <div className="product-not-found-container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
                <ul className="breadcrumb__list">
                    <li className="breadcrumb__item">
                        <Link to="/">Home</Link>
                        <img src={chevronRightIcon} alt="" />
                    </li>
                    <li className="breadcrumb__item">
                        <Link to="/">Shop</Link>
                        <img src={chevronRightIcon} alt="" />
                    </li>
                    <li className="breadcrumb__item breadcrumb__item--current" aria-current="page">
                        Product Not Found
                    </li>
                </ul>
            </nav>

            <section className="product-not-found">
                <h1 className="product-not-found__heading">Product Not Found</h1>
                <p className="product-not-found__message">
                    The product you are looking for does not exist or may have been removed.
                </p>
                <Link to="/" className="button button--primary product-not-found__action">
                    Back to Shop
                </Link>
            </section>

            <ProductRecommendations />
        </div>
    );
};

export default ProductNotFound;
