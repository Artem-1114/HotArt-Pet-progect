import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
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
            setIsSearchOpen(false);
            return;
        }

        const searchProducts = async () => {
            try {
                const productsQuery = query(
                    collection(db, 'products'),
                    where('name', '>=', searchTerm),
                    where('name', '<=', searchTerm + '\uf8ff')
                );
                const querySnapshot = await getDocs(productsQuery);

                const results = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setSearchResults(results.slice(0, 8));
                setIsSearchOpen(results.length > 0);
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([]);
                setIsSearchOpen(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchProducts();
        }, 300);

        return () => clearTimeout(debounceTimer);
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
                        {searchResults.map((product) => {
                            const minPrice = product.variants
                                ? Math.min(...product.variants.map(v => v.price))
                                : 0;

                            return (
                                <div
                                    key={product.id}
                                    className="search-result-item"
                                >
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
                                            {t('search.fromPrice')} {minPrice.toLocaleString()} {t('common.currency')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;