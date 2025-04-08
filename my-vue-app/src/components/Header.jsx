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

const Header = ({ onLoginClick }) => {
    const { currentUser, isAdmin } = useAuth();
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

                <div className="wishlist-icon">
                    <FiHeart />
                    <span className="badge">3</span>
                </div>
                <div className="cart-icon">
                    <FiShoppingCart />
                    <span className="badge">5</span>
                </div>
            </div>
        </header>
    );
};

export default Header;