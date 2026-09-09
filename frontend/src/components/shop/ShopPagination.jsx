import { useProducts } from '../../hooks/ProductContext';
import arrowLeftIcon from '../../assests/icons/arrow_left_icon.svg';
import arrowRightIcon from '../../assests/icons/arrow_right_icon.svg';

export const ShopPagination = () => {
    const { pagination, currentPage, setPage } = useProducts();
    const { totalPages = 1 } = pagination;

    if (totalPages <= 1) return null;

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                start = 2;
                end = 4;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
                end = totalPages - 1;
            }

            if (start > 2) {
                pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <nav className="shop-pagination" aria-label="Product Pagination">
            <button
                type="button"
                className="shop-pagination__btn shop-pagination__btn--prev"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <img src={arrowLeftIcon} alt="" className="shop-pagination__arrow" />
                <span>Previous</span>
            </button>

            <div className="shop-pagination__numbers">
                {pages.map((item, index) => {
                    if (item === '...') {
                        return (
                            <span key={`dots-${index}`} className="shop-pagination__dots">
                                ...
                            </span>
                        );
                    }

                    const isCurrent = item === currentPage;
                    return (
                        <button
                            key={item}
                            type="button"
                            className={`shop-pagination__page-btn ${isCurrent ? 'shop-pagination__page-btn--active' : ''}`}
                            onClick={() => handlePageChange(item)}
                            aria-current={isCurrent ? 'page' : undefined}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                className="shop-pagination__btn shop-pagination__btn--next"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <span>Next</span>
                <img src={arrowRightIcon} alt="" className="shop-pagination__arrow" />
            </button>
        </nav>
    );
};

export default ShopPagination;
