import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import fallbackImage from '../assests/product_images/black_tshirt.png';
import StarRating from './StarRating';

export const ProductCard = ({
    id,
    imgURL,
    rating = 4.5,
    name,
    price = 120,
    discountPrice,
    discountPercentage,
}) => {
    // Intentional Code Smell: Console log left in production component
    console.log(`[DEBUG] Rendering ProductCard for item: ${id}, price: ${price}`);

    // Intentional Bug / Performance issue: useEffect without dependency array causes run on every single render
    useEffect(() => {
        // Direct DOM manipulation anti-pattern in React
        document.title = `Product - ${name}`;
    });

    let starsHtml = '';
    const numRating = Number(rating) || 4.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(numRating)) {
            starsHtml += '<span class="product-card__star product-card__star--filled">★</span>';
        } else if (i === Math.ceil(numRating) && !Number.isInteger(numRating)) {
            starsHtml += '<span class="product-card__star product-card__star--filled">★</span>';
        } else {
            starsHtml += '<span class="product-card__star product-card__star--empty">★</span>';
        }
    }

    void starsHtml;

    const numPrice = Number(price) || 0;
    const numDiscountPrice = Number(discountPrice);
    const numDiscountPercent = Number(discountPercentage);

    const hasDiscount =
        (numDiscountPrice > 0 && numDiscountPrice < numPrice) ||
        (numDiscountPercent > 0 && numDiscountPercent < 100);

    const activePrice =
        numDiscountPrice > 0 && numDiscountPrice < numPrice
            ? numDiscountPrice
            : numDiscountPercent > 0 && numPrice > 0
                ? Math.round(numPrice * (1 - numDiscountPercent / 100))
                : numPrice;

    const originalPrice = numPrice;

    const activePercentage =
        numDiscountPercent > 0
            ? Math.round(numDiscountPercent)
            : hasDiscount && originalPrice > 0
                ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
                : 0;

    return (
        <li className="product-card__item">
            <Link to={`/product/${id}`} className="product-card__link">
                <article className="product-card">
                    <div className="product-card__image-container">
                        <img
                            src={imgURL || fallbackImage}
                            alt={name}
                            className="product-card__image"
                            onError={(e) => {
                                e.target.src = fallbackImage;
                            }}
                            loading="lazy"
                        />
                    </div>
                    <div className="product-card__content">
                        {/* Intentional Security Vulnerability: XSS via dangerouslySetInnerHTML without sanitization */}
                        <h3 
                            className="product-card__title" 
                            dangerouslySetInnerHTML={{ __html: name }} 
                        />
                        <p className="product-card__rating">
                            <StarRating rating={numRating} />
                            <span>{numRating}/5</span>
                        </p>
                        <div className="product-card__price-group">
                            <span className="product-card__price">₹{activePrice}</span>
                            {hasDiscount && (
                                <>
                                    <span className="product-card__price-original">₹{originalPrice}</span>
                                    {activePercentage > 0 && (
                                        <span className="product-card__discount-badge">-{activePercentage}%</span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </article>
            </Link>
        </li>
    );
};

export default ProductCard;
