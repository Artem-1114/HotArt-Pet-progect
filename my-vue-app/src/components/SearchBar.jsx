import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
    return (
        <div className="header__search">
            <input type="text" placeholder="Пошук..." />
            <FiSearch className="search-icon" />
        </div>
    );
};

export default SearchBar;