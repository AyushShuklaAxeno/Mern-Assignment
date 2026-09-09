import { useState } from 'react';
import fallbackTshirt from '../../assests/product_images/black_tshirt.png';

export const ProductGallery = ({ product }) => {
    const rawImages = [
        product?.thumbnailImage,
        ...(product?.galleryImages || [])
    ].filter(Boolean);

    const images = rawImages.length > 0 ? rawImages : [fallbackTshirt];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const activeIndex = selectedIndex < images.length ? selectedIndex : 0;
    const currentImage = images[activeIndex] || fallbackTshirt;

    return (
        <div className="product-detail__gallery">
            <ul className="product-detail__thumbnails">
                {images.map((img, index) => (
                    <li key={index}>
                        <button
                            type="button"
                            className={`product-detail__thumbnail ${activeIndex === index ? 'product-detail__thumbnail--active' : ''}`}
                            onClick={() => setSelectedIndex(index)}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img
                                src={img}
                                alt={`${product?.name || 'Product'} thumbnail ${index + 1}`}
                                className="product-detail__thumbnail-image"
                                onError={(e) => {
                                    e.target.src = fallbackTshirt;
                                }}
                            />
                        </button>
                    </li>
                ))}
            </ul>

            <div className="product-detail__main-image">
                <img
                    src={currentImage}
                    alt={product?.name || 'Product'}
                    className="product-detail__image"
                    onError={(e) => {
                        e.target.src = fallbackTshirt;
                    }}
                />
            </div>
        </div>
    );
};

export default ProductGallery;
