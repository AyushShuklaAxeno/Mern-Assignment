import { useState } from 'react';
import filterIcon from '../../assests/icons/filter_icon.svg';
import checkIcon from '../../assests/icons/circular-right_icon.svg';

const INITIAL_REVIEWS = [
    {
        id: 1,
        name: 'Samantha D.',
        stars: '★★★★★',
        ratingLabel: '5 stars',
        text: '"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. It’s soft, breathable, and the fit is perfect. I’ve received so many compliments on it."',
        date: 'Posted on August 14, 2023',
    },
    {
        id: 2,
        name: 'Alex M.',
        stars: '★★★★☆',
        ratingLabel: '4 stars',
        text: '"I bought this shirt for a casual event, and the quality exceeded my expectations. The color is rich, and the print is clean and sharp."',
        date: 'Posted on August 15, 2023',
    },
    {
        id: 3,
        name: 'Ethan R.',
        stars: '★★★★★',
        ratingLabel: '5 stars',
        text: '"This T-shirt is a must-have for anyone who appreciates good design. The material feels premium, and the fit is flattering without being too tight."',
        date: 'Posted on August 16, 2023',
    },
    {
        id: 4,
        name: 'Olivia P.',
        stars: '★★★★☆',
        ratingLabel: '4 stars',
        text: '"The fabric is soft, and the print looks great. It feels like a higher-end brand product, and the fit and feel make it easy to wear all day."',
        date: 'Posted on August 17, 2023',
    },
    {
        id: 5,
        name: 'Liam K.',
        stars: '★★★★★',
        ratingLabel: '5 stars',
        text: '"This is my second purchase, and it still looks amazing. The shirt is lightweight but feels sturdy, and the design gives it a premium look."',
        date: 'Posted on August 18, 2023',
    },
    {
        id: 6,
        name: 'Ava H.',
        stars: '★★★★☆',
        ratingLabel: '4 stars',
        text: '"The shirt feels comfortable and stylish. I like how the fabric drapes and how the design stands out without being too loud."',
        date: 'Posted on August 19, 2023',
    },
];

export const ProductReviews = () => {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [hasLoadedMore, setHasLoadedMore] = useState(false);

    const handleLoadMore = () => {
        if (!hasLoadedMore) {
            setReviews(prev => [
                ...prev,
                {
                    id: 7,
                    name: 'Chloe B.',
                    stars: '★★★★★',
                    ratingLabel: '5 stars',
                    text: '"Exceeded all my expectations. The fabric weight is just right and it holds up great after multiple washes."',
                    date: 'Posted on August 22, 2023',
                },
                {
                    id: 8,
                    name: 'Daniel W.',
                    stars: '★★★★☆',
                    ratingLabel: '4 stars',
                    text: '"Very satisfied with the purchase! Delivery was fast and the fit matches the size guide accurately."',
                    date: 'Posted on August 25, 2023',
                },
            ]);
            setHasLoadedMore(true);
        }
    };

    return (
        <section className="reviews-section">
            <div className="reviews-header">
                <div className="reviews-header__title-wrap">
                    <h2 className="reviews-header__title">
                        All Reviews <span className="reviews-header__title-count">({reviews.length})</span>
                    </h2>
                </div>

                <div className="reviews-header__controls">
                    <button
                        className="reviews-header__filter reviews-header__filter--toggle"
                        type="button"
                        aria-label="Toggle review filter"
                    >
                        <img className="reviews-header__filter-icon" src={filterIcon} alt="" />
                    </button>
                    <button className="reviews-header__filter reviews-header__filter--active" type="button">
                        Latest
                    </button>
                    <button className="reviews-header__button" type="button">
                        Write a Review
                    </button>
                </div>
            </div>

            <div className="reviews-grid">
                {reviews.map((rev) => (
                    <article key={rev.id} className="review-card">
                        <div className="review-card__top">
                            <div className="review-card__stars" aria-label={rev.ratingLabel}>
                                {rev.stars}
                            </div>
                            <button className="review-card__menu" type="button" aria-label="More options">
                                •••
                            </button>
                        </div>

                        <div className="review-card__user">
                            <h3 className="review-card__user-name">{rev.name}</h3>
                            <img src={checkIcon} alt="Verified customer" />
                        </div>

                        <p className="review-card__text">{rev.text}</p>
                        <p className="review-card__date">{rev.date}</p>
                    </article>
                ))}
            </div>

            {!hasLoadedMore && (
                <div className="reviews-load-more">
                    <button
                        type="button"
                        className="button button--secondary reviews-load-more__button"
                        onClick={handleLoadMore}
                    >
                        Load More Reviews
                    </button>
                </div>
            )}
        </section>
    );
};

export default ProductReviews;
