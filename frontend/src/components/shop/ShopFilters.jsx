import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { useProducts } from '../../hooks/ProductContext';
import { useCategories } from '../../hooks/CategoryContext';

const AVAILABLE_SIZES = [
    'XX-Small',
    'X-Small',
    'Small',
    'Medium',
    'Large',
    'X-Large',
    'XL-Large',
    'XLL-Large',
    'XLLL-Large',
];

const DRESS_STYLES = ['Casual', 'Formal', 'Party', 'Gym'];

const MIN_LIMIT = 0;
const MAX_LIMIT = 50000;
const STEP = 500;

export const ShopFilters = ({ onClose, isMobile = false }) => {
    const { filters, setFilter, applyFilters, resetFilters } = useProducts();
    const { categories } = useCategories();

    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isSizeOpen, setIsSizeOpen] = useState(true);
    const [isStyleOpen, setIsStyleOpen] = useState(true);

    const currentMin = filters.minPrice !== undefined && filters.minPrice !== '' ? Number(filters.minPrice) : MIN_LIMIT;
    const currentMax = filters.maxPrice !== undefined && filters.maxPrice !== '' ? Number(filters.maxPrice) : MAX_LIMIT;

    const minPercent = Math.min(100, Math.max(0, ((currentMin - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));
    const maxPercent = Math.min(100, Math.max(0, ((currentMax - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));

    const handleMinSliderChange = (e) => {
        const val = Math.min(Number(e.target.value), currentMax - STEP);
        setFilter('minPrice', val);
    };

    const handleMaxSliderChange = (e) => {
        const val = Math.max(Number(e.target.value), currentMin + STEP);
        setFilter('maxPrice', val);
    };

    const defaultCategories = [
        { _id: 'cat-tshirts', name: 'T-shirts' },
        { _id: 'cat-shorts', name: 'Shorts' },
        { _id: 'cat-shirts', name: 'Shirts' },
        { _id: 'cat-hoodie', name: 'Hoodie' },
        { _id: 'cat-jeans', name: 'Jeans' },
    ];

    const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

    const handleCategorySelect = (categoryName) => {
        const normalized = categoryName.toLowerCase().trim();
        if (filters.category?.toLowerCase() === normalized) {
            setFilter('category', '');
        } else {
            setFilter('category', normalized);
        }
    };

    const handleSizeSelect = (size) => {
        const normalized = size.toLowerCase().trim();
        if (filters.size?.toLowerCase() === normalized) {
            setFilter('size', '');
        } else {
            setFilter('size', normalized);
        }
    };

    const handleStyleSelect = (style) => {
        const normalized = style.toLowerCase().trim();
        if (filters.dressStyle?.toLowerCase() === normalized) {
            setFilter('dressStyle', '');
        } else {
            setFilter('dressStyle', normalized);
        }
    };

    const handleApply = () => {
        applyFilters();
        if (onClose) onClose();
    };

    const handleReset = () => {
        resetFilters();
        if (onClose) onClose();
    };

    const hasActiveFilters = Boolean(
        filters.category ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.size ||
        filters.dressStyle
    );

    return (
        <aside className={`shop-filters ${isMobile ? 'shop-filters--mobile' : ''}`}>

            <div className="shop-filters__header">
                <div className="shop-filters__title-group">
                    <h3 className="shop-filters__title">Filters</h3>
                    <SlidersHorizontal size={18} className="shop-filters__filter-icon" />
                </div>
                {isMobile && (
                    <button
                        type="button"
                        className="shop-filters__close-button"
                        onClick={onClose}
                        aria-label="Close filters"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            <hr className="shop-filters__divider" />

            <ul className="shop-filters__categories">
                {displayCategories.map((cat) => {
                    const isSelected = filters.category?.toLowerCase() === cat.name.toLowerCase();
                    return (
                        <li key={cat._id || cat.name} className="shop-filters__category-item">
                            <button
                                type="button"
                                className={`shop-filters__category-button ${isSelected ? 'shop-filters__category-button--active' : ''}`}
                                onClick={() => handleCategorySelect(cat.name)}
                            >
                                <span className="shop-filters__category-name">{cat.name}</span>
                                <ChevronRight
                                    size={16}
                                    className="shop-filters__chevron"
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>

            <hr className="shop-filters__divider" />

            <div className="shop-filters__section">
                <button
                    type="button"
                    className="shop-filters__section-header"
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                    <span className="shop-filters__section-title">Price</span>
                    <ChevronDown
                        size={18}
                        className={`shop-filters__accordion-arrow ${isPriceOpen ? 'shop-filters__accordion-arrow--open' : ''}`}
                    />
                </button>

                {isPriceOpen && (
                    <div className="shop-filters__price-body">
                        <div className="shop-filters__price-slider">
                            <div className="shop-filters__slider-track" />
                            <div
                                className="shop-filters__slider-progress"
                                data-min-percent={minPercent}
                                data-max-percent={maxPercent}
                            />
                            <input
                                type="range"
                                min={MIN_LIMIT}
                                max={MAX_LIMIT}
                                step={STEP}
                                value={currentMin}
                                onChange={handleMinSliderChange}
                                className="shop-filters__range shop-filters__range--min"
                                aria-label="Minimum price"
                            />
                            <input
                                type="range"
                                min={MIN_LIMIT}
                                max={MAX_LIMIT}
                                step={STEP}
                                value={currentMax}
                                onChange={handleMaxSliderChange}
                                className="shop-filters__range shop-filters__range--max"
                                aria-label="Maximum price"
                            />
                        </div>

                        <div className="shop-filters__price-values">
                            <span className="shop-filters__price-value">₹{currentMin.toLocaleString()}</span>
                            <span className="shop-filters__price-value">₹{currentMax.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>

            <hr className="shop-filters__divider" />

            <div className="shop-filters__section">
                <button
                    type="button"
                    className="shop-filters__section-header"
                    onClick={() => setIsSizeOpen(!isSizeOpen)}
                >
                    <span className="shop-filters__section-title">Size</span>
                    <ChevronDown
                        size={18}
                        className={`shop-filters__accordion-arrow ${isSizeOpen ? 'shop-filters__accordion-arrow--open' : ''}`}
                    />
                </button>

                {isSizeOpen && (
                    <div className="shop-filters__sizes-grid">
                        {AVAILABLE_SIZES.map((size) => {
                            const isSelected = filters.size?.toLowerCase() === size.toLowerCase();
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    className={`shop-filters__size-chip ${isSelected ? 'shop-filters__size-chip--active' : ''}`}
                                    onClick={() => handleSizeSelect(size)}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <hr className="shop-filters__divider" />

            <div className="shop-filters__section">
                <button
                    type="button"
                    className="shop-filters__section-header"
                    onClick={() => setIsStyleOpen(!isStyleOpen)}
                >
                    <span className="shop-filters__section-title">Dress Style</span>
                    <ChevronDown
                        size={18}
                        className={`shop-filters__accordion-arrow ${isStyleOpen ? 'shop-filters__accordion-arrow--open' : ''}`}
                    />
                </button>

                {isStyleOpen && (
                    <ul className="shop-filters__styles-list">
                        {DRESS_STYLES.map((style) => {
                            const isSelected = filters.dressStyle?.toLowerCase() === style.toLowerCase();
                            return (
                                <li key={style} className="shop-filters__style-item">
                                    <button
                                        type="button"
                                        className={`shop-filters__style-button ${isSelected ? 'shop-filters__style-button--active' : ''}`}
                                        onClick={() => handleStyleSelect(style)}
                                    >
                                        <span>{style}</span>
                                        <ChevronRight
                                            size={16}
                                            className="shop-filters__chevron"
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>


            <div className="shop-filters__actions">
                <button
                    type="button"
                    className="button button--primary shop-filters__apply-btn"
                    onClick={handleApply}
                >
                    Apply Filter
                </button>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="shop-filters__reset-btn"
                        onClick={handleReset}
                    >
                        Reset All Filters
                    </button>
                )}
            </div>
        </aside>
    );
};

export default ShopFilters;
