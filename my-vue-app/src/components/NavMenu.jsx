import { Link } from "react-router-dom";

const NavMenu = () => {
    return (
        <nav className="header__nav">
            <Link to="/categories">Категорії</Link>
            <Link to="/sales">Акції</Link>
            <Link to="/stores">Магазини</Link>
        </nav>
    );
};

export default NavMenu;