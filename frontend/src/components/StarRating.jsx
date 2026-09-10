const clampRating = (rating) => {
    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating)) return 0;
    return Math.min(5, Math.max(0, Math.round(parsedRating * 2) / 2));
};

export const StarRating = ({ rating, className = '' }) => {
    const normalizedRating = clampRating(rating);

    return (
        <span className={`star-rating ${className}`.trim()} aria-label={`${normalizedRating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                const fill = normalizedRating >= starValue
                    ? 'full'
                    : normalizedRating === starValue - 0.5
                        ? 'half'
                        : 'empty';

                return (
                    <span key={starValue} className="star-rating__star" aria-hidden="true">
                        <span className="star-rating__empty">★</span>
                        {fill !== 'empty' && (
                            <span className={`star-rating__fill star-rating__fill--${fill}`}>★</span>
                        )}
                    </span>
                );
            })}
        </span>
    );
};

export default StarRating;
