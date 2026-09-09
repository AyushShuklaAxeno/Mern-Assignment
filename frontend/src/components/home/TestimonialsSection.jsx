import arrowLeft from '../../assests/icons/arrow_left_icon.svg';
import arrowRight from '../../assests/icons/arrow_right_icon.svg';

const TESTIMONIALS_DATA = [
    {
        name: 'Sarah M.',
        quote:
            "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
        name: 'Alex K.',
        quote:
            'Finding clothes that fit my personal style used to be a struggle until I discovered Shop.co. The range of options they offer is truly remarkable.',
    },
    {
        name: 'James L.',
        quote:
            "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with latest trends.",
    },
];

export const TestimonialsSection = () => {
    return (
        <section className="testimonials">
            <div className="testimonials__header-group">
                <h3 className="testimonials__title">OUR HAPPY CUSTOMERS</h3>

                <div className="testimonials__arrow-group">
                    <button type="button" className="testimonials__arrow-group__button" aria-label="Previous testimonials">
                        <img src={arrowLeft} alt="Scroll left" />
                    </button>
                    <button type="button" className="testimonials__arrow-group__button" aria-label="Next testimonials">
                        <img src={arrowRight} alt="Scroll right" />
                    </button>
                </div>
            </div>

            <ul className="testimonials__list">
                {TESTIMONIALS_DATA.map((item, index) => (
                    <li key={index} className="testimonials-card">
                        <div className="testimonials-card__stars">
                            ★★★★★
                        </div>
                        <p className="testimonials-card__author">{item.name}</p>
                        <p className="testimonials-card__quote">"{item.quote}"</p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TestimonialsSection;
