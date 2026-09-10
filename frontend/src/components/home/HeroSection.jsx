import heroBanner from '../../assests/images/hero_banner.png';
import heroBannerMobile from '../../assests/images/hero_banner_mobile-view.png';
import heroStarIcon from '../../assests/icons/hero_star_icon.svg';

export const HeroSection = ({ onShopNow }) => {
    return (
        <section className="hero">
            <div className="hero__content-container">
                <div className="hero__text-block">
                    <div className="hero__intro">
                        <h1 className="hero__heading">
                            FIND CLOTHES <br />
                            THAT MATCHES <br />
                            YOUR STYLE
                        </h1>
                        <p className="hero__description">
                            Browse through our diverse range of meticulously crafted garments, designed
                            to bring out your individuality and cater to your sense of style.
                        </p>
                        <button
                            type="button"
                            className="button button--primary hero__cta-button"
                            onClick={onShopNow}
                        >
                            Shop Now
                        </button>
                    </div>

                    <ul className="hero__stats">
                        <li className="hero__stat">
                            <span className="hero__stat-number">200+</span>
                            <p className="hero__stat-label">International Brands</p>
                        </li>

                        <li className="hero__stat-divider" aria-hidden="true" />

                        <li className="hero__stat">
                            <span className="hero__stat-number">2,000+</span>
                            <p className="hero__stat-label">High-Quality Products</p>
                        </li>

                        <li className="hero__stat-divider hero__stat-divider--desktop" aria-hidden="true" />

                        <li className="hero__stat hero__stat--full">
                            <span className="hero__stat-number">30,000+</span>
                            <p className="hero__stat-label">Happy Customers</p>
                        </li>
                    </ul>
                </div>

                <div className="hero__image-wrapper">
                    <picture className="hero__banner-picture">
                        <source media="(max-width: 768px)" srcSet={heroBannerMobile} />
                        <img src={heroBanner} className="hero__banner" alt="Model wearing featured outfit" />
                    </picture>

                    <div className="hero__decoration">
                        <img src={heroStarIcon} className="hero__star-icon hero__star-icon--small" alt="" />
                        <img src={heroStarIcon} className="hero__star-icon hero__star-icon--large" alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
