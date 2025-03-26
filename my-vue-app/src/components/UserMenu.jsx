import { FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import AuthModal from "./AuthModal";

const UserMenu = () => {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    return (
        <>
            <div className="header__user-menu">
                <div
                    className="user-icon"
                    onClick={() => setAuthModalOpen(true)}
                    title="Профіль"
                >
                    <FiUser />
                </div>
                <div className="wishlist-icon">
                    <FiHeart />
                    <span className="badge">3</span>
                </div>
                <div className="cart-icon">
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