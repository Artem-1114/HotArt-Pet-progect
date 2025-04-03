import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import categoryData from '../data/ArrayOfCategories.jsx';
import '../style/SearchBar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);
    const { t } = useTranslation();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = [];
        const lowerCaseSearchTerm = searchTerm.toLowerCase();


        Object.values(categoryData).forEach(category => {
            category.forEach(product => {
                if (
                    product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    product.brand.toLowerCase().includes(lowerCaseSearchTerm)
                ) {
                    results.push(product);
                }
            });
        });

        setSearchResults(results.slice(0, 8)); 
        setIsSearchOpen(results.length > 0);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearchOpen(false);
    };

    return (
        <div className="header__search" ref={searchRef}>
            <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm && setIsSearchOpen(true)}
            />
            {searchTerm ? (
                <FiX className="search-icon clear-icon" onClick={clearSearch} />
            ) : (
                <FiSearch className="search-icon" />
            )}

            {isSearchOpen && searchResults.length > 0 && (
                <div className="search-results">
                    <div className="search-results-header">
                        <h4>{t('search.resultsTitle')}</h4>
                        <button onClick={() => setIsSearchOpen(false)}>
                            <FiX />
                        </button>
                    </div>
                    <div className="search-results-list">
                        {searchResults.map((product) => (
                            <div key={`${product.id}-${product.brand}`} className="search-result-item">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="search-result-image"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                                    }}
                                />
                                <div className="search-result-info">
                                    <h5>{product.name}</h5>
                                    <p className="search-result-brand">{product.brand}</p>
                                    <p className="search-result-price">
                                        {t('search.fromPrice')} {Math.min(...product.variants.map(v => v.price)).toLocaleString()} {t('common.currency')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;