import envelopIcon from '../../assests/icons/envelop_icon.svg';
import twitterIcon from '../../assests/icons/twitter_icon.svg';
import facebookIcon from '../../assests/icons/facebook_icon.svg';
import instagramIcon from '../../assests/icons/instagram_icon.svg';
import githubIcon from '../../assests/icons/github_icon.svg';
import visaLogo from '../../assests/icons/visa_logo.svg';
import mastercardLogo from '../../assests/icons/mastercard_logo.svg';
import paypalLogo from '../../assests/icons/paypal_logo.svg';
import applePayLogo from '../../assests/icons/apple_pay_logo.svg';
import gPayLogo from '../../assests/icons/g_pay_logo.svg';

export const FooterSection = () => {
    return (
        <section className="footer-container">
            <footer className="footer">
                <div className="newsletter">
                    <h2 className="newsletter__heading">
                        STAY UPTO DATE ABOUT<br />OUR LATEST OFFERS
                    </h2>

                    <form className="newsletter__form" onSubmit={e => e.preventDefault()}>
                        <div className="newsletter__input-wrapper">
                            <img src={envelopIcon} alt="" className="newsletter__input-icon" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="newsletter__input"
                            />
                        </div>
                        <button type="submit" className="newsletter__button">
                            Subscribe to Newsletter
                        </button>
                    </form>
                </div>

                <div className="footer__main">
                    <div className="footer__brand">
                        <p className="footer__logo">SHOP.CO</p>
                        <p className="footer__description">
                            We have clothes that suits your style and which you're proud to wear.
                            From women to men.
                        </p>

                        <ul className="footer__social">
                            <li className="footer__social-item">
                                <a href="#twitter" aria-label="Twitter" className="footer__social-link">
                                    <img src={twitterIcon} alt="Twitter" />
                                </a>
                            </li>
                            <li className="footer__social-item">
                                <a
                                    href="#facebook"
                                    aria-label="Facebook"
                                    className="footer__social-link footer__social-link--filled"
                                >
                                    <img src={facebookIcon} alt="Facebook" />
                                </a>
                            </li>
                            <li className="footer__social-item">
                                <a href="#instagram" aria-label="Instagram" className="footer__social-link">
                                    <img src={instagramIcon} alt="Instagram" />
                                </a>
                            </li>
                            <li className="footer__social-item">
                                <a href="#github" aria-label="Github" className="footer__social-link">
                                    <img src={githubIcon} alt="Github" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    <nav className="footer__column" aria-label="Company">
                        <h3 className="footer__column-title">COMPANY</h3>
                        <ul className="footer__links">
                            <li className="footer__links-item"><a href="#about" className="footer__links-link">About</a></li>
                            <li className="footer__links-item"><a href="#features" className="footer__links-link">Features</a></li>
                            <li className="footer__links-item"><a href="#works" className="footer__links-link">Works</a></li>
                            <li className="footer__links-item"><a href="#career" className="footer__links-link">Career</a></li>
                        </ul>
                    </nav>

                    <nav className="footer__column" aria-label="Help">
                        <h3 className="footer__column-title">HELP</h3>
                        <ul className="footer__links">
                            <li className="footer__links-item"><a href="#support" className="footer__links-link">Customer Support</a></li>
                            <li className="footer__links-item"><a href="#delivery" className="footer__links-link">Delivery Details</a></li>
                            <li className="footer__links-item"><a href="#terms" className="footer__links-link">Terms &amp; Conditions</a></li>
                            <li className="footer__links-item"><a href="#privacy" className="footer__links-link">Privacy Policy</a></li>
                        </ul>
                    </nav>

                    <nav className="footer__column" aria-label="FAQ">
                        <h3 className="footer__column-title">FAQ</h3>
                        <ul className="footer__links">
                            <li className="footer__links-item"><a href="#account" className="footer__links-link">Account</a></li>
                            <li className="footer__links-item"><a href="#deliveries" className="footer__links-link">Manage Deliveries</a></li>
                            <li className="footer__links-item"><a href="#orders" className="footer__links-link">Orders</a></li>
                            <li className="footer__links-item"><a href="#payments" className="footer__links-link">Payments</a></li>
                        </ul>
                    </nav>

                    <nav className="footer__column" aria-label="Resources">
                        <h3 className="footer__column-title">RESOURCES</h3>
                        <ul className="footer__links">
                            <li className="footer__links-item"><a href="#ebooks" className="footer__links-link">Free eBooks</a></li>
                            <li className="footer__links-item"><a href="#tutorial" className="footer__links-link">Development Tutorial</a></li>
                            <li className="footer__links-item"><a href="#blog" className="footer__links-link">How to - Blog</a></li>
                            <li className="footer__links-item"><a href="#youtube" className="footer__links-link">Youtube Playlist</a></li>
                        </ul>
                    </nav>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">Shop.co © 2000-2023, All Rights Reserved</p>

                    <ul className="footer__payments">
                        <li className="footer__payments-item"><img src={visaLogo} alt="Visa" /></li>
                        <li className="footer__payments-item"><img src={mastercardLogo} alt="Mastercard" /></li>
                        <li className="footer__payments-item"><img src={paypalLogo} alt="PayPal" /></li>
                        <li className="footer__payments-item"><img src={applePayLogo} alt="Apple Pay" /></li>
                        <li className="footer__payments-item"><img src={gPayLogo} alt="Google Pay" /></li>
                    </ul>
                </div>
            </footer>
        </section>
    );
};

export default FooterSection;
