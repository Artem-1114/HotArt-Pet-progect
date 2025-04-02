import { FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useTranslation } from 'react-i18next';

const UserMenu = () => {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <div className="header__user-menu">
                <div
                    className="user-icon"
                    onClick={() => setAuthModalOpen(true)}
                    title={t('userMenu.profile')}
                >
                    <FiUser />
                </div>
                <div className="wishlist-icon" title={t('userMenu.wishlist')}>
                    <FiHeart />
                    <span className="badge">3</span>
                </div>
                <div className="cart-icon" title={t('userMenu.cart')}>
                    <FiShoppingCart />
                    <span className="badge">5</span>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setAuthModalOpen(false)}
            />
        </>
    );
};

export default UserMenu;