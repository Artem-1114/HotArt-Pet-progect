import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Припускаючи, що у вас є файл конфігурації Firebase
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
            setIsSearchOpen(false);
            return;
        }

        const searchProducts = async () => {
            try {
                // Пошук в Firebase
                const productsQuery = query(
                    collection(db, 'products'),
                    where('name', '>=', searchTerm),
                    where('name', '<=', searchTerm + '\uf8ff')
                );
                const querySnapshot = await getDocs(productsQuery);

                const firebaseResults = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Пошук в локальних даних
                const localResults = [];
                Object.values(categoryData).forEach(category => {
                    category.forEach(product => {
                        if (
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchTerm.toLowerCase())
                        ) {
                            localResults.push(product);
                        }
                    });
                });

                // Об'єднання результатів з видаленням дублікатів
                const allResults = [...firebaseResults, ...localResults];
                const uniqueResults = allResults.filter(
                    (product, index, self) => index === self.findIndex(p =>
                        (p.id && p.id === product.id) ||
                        (!p.id && p.name === product.name && p.brand === product.brand)
                    )
                );

                setSearchResults(uniqueResults.slice(0, 8));
                setIsSearchOpen(uniqueResults.length > 0);
            } catch (error) {
                console.error("Search error:", error);
                // Якщо помилка з Firebase, використовуємо лише локальні дані
                const localResults = [];
                Object.values(categoryData).forEach(category => {
                    category.forEach(product => {
                        if (
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchTerm.toLowerCase())
                        ) {
                            localResults.push(product);
                        }
                    });
                });
                setSearchResults(localResults.slice(0, 8));
                setIsSearchOpen(localResults.length > 0);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchProducts();
        }, 300); // Додано дебаунс для зменшення кількості запитів

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
                            // Визначаємо мінімальну ціну
                            const minPrice = product.variants
                                ? Math.min(...product.variants.map(v => v.price))
                                : product.price
                                    ? product.price
                                    : 0;

                            return (
                                <div
                                    key={product.id || `${product.name}-${product.brand}`}
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