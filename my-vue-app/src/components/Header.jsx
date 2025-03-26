import { Link } from "react-router-dom";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import "../style/Header.css";

const Header = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <NavMenu />
            <SearchBar />
            <UserMenu />
        </header>
    );
};

export default Header;
