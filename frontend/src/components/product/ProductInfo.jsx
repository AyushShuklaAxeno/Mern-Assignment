import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/CartContext';
import { useAuth } from '../../hooks/AuthContext';
import StarRating from '../StarRating';

const COLORS = [
    { name: 'Olive Green', code: '#4F4631' },
    { name: 'Deep Teal', code: '#314F4A' },
    { name: 'Navy Blue', code: '#31344F' },
];

export const ProductInfo = ({ product, onAddToCart }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const variants = product?.variants || [];
    const rawSizes = variants.length > 0
        ? variants.map(v => v.size)
        : ['Small', 'Medium', 'Large', 'X-Large'];

    const sizes = [...new Set(rawSizes)];

    const [selectedColor, setSelectedColor] = useState(COLORS[0].code);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const firstAvailableSize = sizes.find(s => {
        const v = variants.find(item => item.size?.toString().toLowerCase() === s?.toString().toLowerCase());
        return v && Number(v.quantity) > 0;
    }) || sizes[0] || 'Medium';

    const activeSize = (selectedSize && sizes.includes(selectedSize)) ? selectedSize : firstAvailableSize;

    // Calculate stock for the currently selected size
    const currentVariant = variants.find(
        v => v.size?.toString().toLowerCase() === activeSize?.toString().toLowerCase()
    );

    const stock = currentVariant !== undefined
        ? Number(currentVariant.quantity)
        : (variants.length > 0 ? 0 : 10);

    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock < 5;

    const basePrice = Number(product?.price) || 0;
    const numDiscountPrice = Number(product?.discountPrice);
    const numDiscountPercent = Number(product?.discountPercentage);

    const hasDiscount =
        (numDiscountPrice > 0 && numDiscountPrice < basePrice) ||
        (numDiscountPercent > 0 && numDiscountPercent < 100);

    const currentPrice =
        numDiscountPrice > 0 && numDiscountPrice < basePrice
            ? numDiscountPrice
            : numDiscountPercent > 0 && basePrice > 0
                ? Math.round(basePrice * (1 - numDiscountPercent / 100))
                : basePrice;

    const originalPrice = basePrice;

    const discount =
        numDiscountPercent > 0
            ? Math.round(numDiscountPercent)
            : hasDiscount && originalPrice > 0
                ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                : 0;

    const handleQuantityChange = (delta) => {
        if (isOutOfStock || isAdding) return;
        setQuantity(prev => {
            const next = prev + delta;
            if (next < 1) return 1;
            if (stock > 0 && next > stock) return stock;
            return next;
        });
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
            return;
        }

        if (isOutOfStock || isAdding) return;

        try {
            setIsAdding(true);
            await addToCart({
                product: {
                    ...product,
                    price: currentPrice,
                    discountPrice: product?.discountPrice,
                    discountPercentage: product?.discountPercentage,
                },
                size: activeSize,
                color: selectedColor,
                quantity,
            });

            if (onAddToCart) {
                await onAddToCart({
                    productId: product?._id,
                    size: activeSize,
                    color: selectedColor,
                    quantity,
                });
            }

            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="product-detail__info">
            <div className="product-detail__info__group">
                <h1 className="product-detail__title">{product?.name || 'One Life Graphic T-shirt'}</h1>

                <div className="product-detail__rating">
                    <StarRating rating={product?.rating || 4.5} />
                    <span className="product-detail__rating-value">{product?.rating || 4.5}/5</span>
                </div>

                <div className="product-detail__price">
                    <span className="product-detail__price-current">₹{currentPrice}</span>
                    {hasDiscount && (
                        <>
                            <span className="product-detail__price-original">₹{originalPrice}</span>
                            {discount > 0 && (
                                <span className="product-detail__discount-badge">-{discount}%</span>
                            )}
                        </>
                    )}
                </div>

                <p className="product-detail__description">
                    {product?.description ||
                        'This graphic t-shirt is perfect for any casual occasion. Crafted from a soft and breathable cotton fabric, it offers superior comfort and style.'}
                </p>
            </div>

            <hr className="product-detail__divider" />

            <div className="product-detail__info__group">
                <p className="product-detail__section-label">Select Colors</p>
                <div className="product-detail__color-options">
                    {COLORS.map((color) => {
                        const isSelected = selectedColor === color.code;
                        return (
                            <button
                                key={color.code}
                                type="button"
                                className={`color-swatch ${isSelected ? 'color-swatch--active' : ''}`}
                                data-color={color.code}
                                onClick={() => setSelectedColor(color.code)}
                                aria-label={`Select color ${color.name}`}
                            >
                                {isSelected && <span className="color-swatch__check">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <hr className="product-detail__divider" />

            <div className="product-detail__info__group">
                <p className="product-detail__section-label">Choose Size</p>
                <div className="product-detail__size-options">
                    {sizes.map((size) => {
                        const v = variants.find(
                            item => item.size?.toString().toLowerCase() === size?.toString().toLowerCase()
                        );
                        const sizeStock = v !== undefined ? Number(v.quantity) : 10;
                        const isZero = sizeStock === 0;

                        return (
                            <button
                                key={size}
                                type="button"
                                className={`size-option ${activeSize === size ? 'size-option--active' : ''} ${isZero ? 'size-option--disabled' : ''}`}
                                onClick={() => {
                                    setSelectedSize(size);
                                    setQuantity(1);
                                }}
                                title={isZero ? `${size} (Out of stock)` : `${size} (${sizeStock} in stock)`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>

                {isLowStock && (
                    <div className="product-detail__stock-indicator product-detail__stock-indicator--low">
                        <span className="product-detail__stock-dot" />
                        <span>Hurry up! Only {stock} left</span>
                    </div>
                )}

                {isOutOfStock && (
                    <div className="product-detail__stock-indicator product-detail__stock-indicator--out">
                        <span className="product-detail__stock-dot" />
                        <span>Out of stock</span>
                    </div>
                )}
            </div>

            <hr className="product-detail__divider" />

            <div className="product-detail__actions">
                <div className="quantity-selector">
                    <button
                        type="button"
                        className="quantity-selector__button quantity-selector__button--decrease"
                        aria-label="Decrease quantity"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={isOutOfStock || isAdding}
                    >
                        −
                    </button>
                    <span className="quantity-selector__value">{isOutOfStock ? 0 : quantity}</span>
                    <button
                        type="button"
                        className="quantity-selector__button quantity-selector__button--increase"
                        aria-label="Increase quantity"
                        onClick={() => handleQuantityChange(1)}
                        disabled={isOutOfStock || isAdding || (stock > 0 && quantity >= stock)}
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    className={`button button--primary product-detail__add-to-cart ${isAdding ? 'product-detail__add-to-cart--loading' : ''}`}
                    disabled={isOutOfStock || isAdding}
                    onClick={handleAddToCart}
                >
                    {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : isAdded ? 'Added to Cart' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
