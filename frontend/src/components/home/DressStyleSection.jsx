import { Link } from 'react-router-dom';
import casualBanner from '../../assests/images/casual_wear_banner.png';
import formalBanner from '../../assests/images/formal_wear_banner.png';
import partyBanner from '../../assests/images/party_wear_banner.png';
import gymBanner from '../../assests/images/gym_wear_banner.png';

export const DressStyleSection = () => {
    return (
        <section className="dress-style">
            <div className="dress-style__container">
                <h2 className="dress-style__title">BROWSE BY DRESS STYLE</h2>

                <ul className="dress-style__list">
                    <li className="dress-style__item dress-style__item--casual">
                        <Link to="/shop?dressStyle=casual" className="dress-style__link">
                            <span className="dress-style__label">Casual</span>
                            <img
                                src={casualBanner}
                                alt="Casual style"
                                className="dress-style__image"
                            />
                        </Link>
                    </li>

                    <li className="dress-style__item dress-style__item--formal">
                        <Link to="/shop?dressStyle=formal" className="dress-style__link">
                            <span className="dress-style__label">Formal</span>
                            <img
                                src={formalBanner}
                                alt="Formal style"
                                className="dress-style__image"
                            />
                        </Link>
                    </li>

                    <li className="dress-style__item dress-style__item--party">
                        <Link to="/shop?dressStyle=party" className="dress-style__link">
                            <span className="dress-style__label">Party</span>
                            <img
                                src={partyBanner}
                                alt="Party style"
                                className="dress-style__image"
                            />
                        </Link>
                    </li>

                    <li className="dress-style__item dress-style__item--gym">
                        <Link to="/shop?dressStyle=gym" className="dress-style__link">
                            <span className="dress-style__label">Gym</span>
                            <img
                                src={gymBanner}
                                alt="Gym style"
                                className="dress-style__image"
                            />
                        </Link>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default DressStyleSection;
