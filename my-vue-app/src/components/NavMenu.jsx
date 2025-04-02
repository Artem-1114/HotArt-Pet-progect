import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const NavMenu = () => {
    const { t } = useTranslation();

    return (
        <nav className="header__nav">
            <Link to="/categories">{t('navigation.categories')}</Link>
            <Link to="/sales">{t('navigation.sales')}</Link>
            <Link to="/stores">{t('navigation.stores')}</Link>
        </nav>
    );
};

export default NavMenu;