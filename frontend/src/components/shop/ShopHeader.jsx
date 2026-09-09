import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/ProductContext';
import filterIcon from '../../assests/icons/filter_icon.svg';

const formatTitle = (text) => {
    if (!text) return '';
    return text
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const ShopHeader = ({ onOpenMobileFilters, title }) => {
    const { pagination, appliedFilters, setSort } = useProducts();
    const [searchParams] = useSearchParams();

    const { totalProducts = 0, currentPage = 1, limit = 9 } = pagination;
    const startIndex = totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endIndex = Math.min(currentPage * limit, totalProducts);

    const paramStyle =
        searchParams.get('dressStyle') ||
        searchParams.get('dressstyle') ||
        searchParams.get('dress_style') ||
        searchParams.get('style') ||
        '';
    const paramCategory = searchParams.get('category') || '';

    const effectiveStyle = paramStyle || appliedFilters.dressStyle || '';
    const effectiveCategory = paramCategory || appliedFilters.category || '';

    const displayTitle =
        title ||
        (effectiveStyle
            ? formatTitle(effectiveStyle)
            : effectiveCategory
            ? formatTitle(effectiveCategory)
            : 'Casual');

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    return (
        <div className="shop-header">
            <div className="shop-header__left">
                <h1 className="shop-header__title">{displayTitle}</h1>
            </div>

            <div className="shop-header__right">
                <p className="shop-header__count">
                    Showing {startIndex}-{endIndex} of {totalProducts} Products
                </p>

                <div className="shop-header__sort-group">
                    <label htmlFor="shopSortSelect" className="shop-header__sort-label">
                        Sort by:
                    </label>
                    <select
                        id="shopSortSelect"
                        className="shop-header__sort-select"
                        value={appliedFilters.sort || 'popular'}
                        onChange={handleSortChange}
                    >
                        <option value="popular">Most Popular</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="shop-header__mobile-filter-btn"
                    onClick={onOpenMobileFilters}
                    aria-label="Open filters"
                >
                    <img src={filterIcon} alt="" />
                </button>
            </div>
        </div>
    );
};

export default ShopHeader;
