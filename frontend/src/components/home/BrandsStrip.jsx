import versaceLogo from '../../assests/icons/versace_logo_icon.svg';
import zaraLogo from '../../assests/icons/zara_logo_icon.svg';
import gucciLogo from '../../assests/icons/gucci_logo_icon.svg';
import pradaLogo from '../../assests/icons/parada_logo_icon.svg';
import ckLogo from '../../assests/icons/ck_logo_icon.svg';

export const BrandsStrip = () => {
    return (
        <section className="brands">
            <img src={versaceLogo} alt="Versace" className="brands__img" />
            <img src={zaraLogo} alt="Zara" className="brands__img" />
            <img src={gucciLogo} alt="Gucci" className="brands__img" />
            <img src={pradaLogo} alt="Prada" className="brands__img" />
            <img src={ckLogo} alt="Calvin Klein" className="brands__img" />
        </section>
    );
};

export default BrandsStrip;
