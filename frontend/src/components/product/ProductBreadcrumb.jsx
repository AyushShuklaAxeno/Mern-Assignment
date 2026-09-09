import { Link } from 'react-router-dom';
import chevronRightIcon from '../../assests/icons/chevron_right.svg';

export const ProductBreadcrumb = ({ product }) => {
    const categoryName = product?.category?.[0]?.name || 'T-shirts';
    const productName = product?.name || 'Product Details';

    return (
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
                <li className="breadcrumb__item">
                    <span>{categoryName}</span>
                    <img src={chevronRightIcon} alt="" />
                </li>
                <li className="breadcrumb__item breadcrumb__item--current" aria-current="page">
                    {productName}
                </li>
            </ul>
        </nav>
    );
};

export default ProductBreadcrumb;
