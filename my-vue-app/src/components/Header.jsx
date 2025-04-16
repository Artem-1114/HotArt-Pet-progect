import { Link } from "react-router-dom";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import SearchBar from "./SearchBar";
import { FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import "../style/Header.css";
import { useAuth } from "./AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useWishlist } from "./WishlistContext";

const Header = ({ onLoginClick }) => {
    const { currentUser, isAdmin } = useAuth();
    const { wishlist, cart } = useWishlist();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <NavMenu />
            <SearchBar />

            <div className="header__user-menu">
                <div
                    className="user-icon-container"
                    onClick={() => currentUser && setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div
                        className="user-icon"
                        onClick={!currentUser ? onLoginClick : undefined}
                    >
                        <FiUser />
                        {currentUser && <span className="auth-badge"></span>}
                    </div>

                    {isDropdownOpen && currentUser && (
                        <div className="user-dropdown">
                            <Link
                                to="/profile"
                                className="dropdown-item"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                Профіль
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="dropdown-item"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Адмін панель
                                </Link>
                            )}
                            <button
                                className="dropdown-item"
                                onClick={handleLogout}
                            >
                                Вийти
                            </button>
                        </div>
                    )}
                </div>

                <Link to="/wishlist" className="wishlist-icon">
                    <FiHeart />
                    {wishlist.length > 0 && (
                        <span className="badge">{wishlist.length}</span>
                    )}
                </Link>
                <Link to="/cart" className="cart-icon">
                    <FiShoppingCart />
                    {cart.length > 0 && (
                        <span className="badge">{cart.length}</span>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;