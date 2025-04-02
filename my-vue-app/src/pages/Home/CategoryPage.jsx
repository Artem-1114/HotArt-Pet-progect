import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import categoryData from '../../components/ArrayOfCategories';
import '../../style/CategoryPage.css';

const CategoryPage = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        setTimeout(() => {
            setProducts(categoryData[id] || []);
            setLoading(false);
        }, 800);
    }, [id]);

    const getUniqueBrands = () => {
        const brands = new Set();
        (categoryData[id] || []).forEach(product => brands.add(product.brand));
        return Array.from(brands).sort();
    };

    const sortProducts = () => {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
            case 'brand': return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
            default: return sorted;
        }
    };

    const filterByBrands = (products) => {
        if (selectedBrands.length === 0) return products;
        return products.filter(product => selectedBrands.includes(product.brand));
    };

    const handleBrandToggle = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
        setCurrentPage(1);
    };

    const processedProducts = filterByBrands(sortProducts());
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(processedProducts.length / productsPerPage);

    const categoryTitles = {
        phones: 'Смартфони',
        tablets: 'Планшети',
        washingMachines: 'Пральні машини',
        ovens: 'Духові шафи',
        laptops: 'Ноутбуки',
        tvs: 'Телевізори'
    };

    return (
        <div className="category-page" id="category-page">
            <h1 className="category-page__title">{categoryTitles[id] || 'Категорія'}</h1>

            <div className="category-filters">
                <div className="brand-filter">
                    <h3 className="brand-filter__title">Фільтр по брендам:</h3>
                    <div className="brand-filter__options">
                        {getUniqueBrands().map(brand => (
                            <label key={brand} className="brand-option">
                                <input
                                    type="checkbox"
                                    className="brand-option__checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandToggle(brand)}
                                />
                                <span className="brand-option__label">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="sort-filter">
                    <label className="sort-filter__label">Сортування:</label>
                    <select
                        className="sort-filter__select"
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="default">За замовчуванням</option>
                        <option value="price-asc">Від дешевих до дорогих</option>
                        <option value="price-desc">Від дорогих до дешевих</option>
                        <option value="brand">За виробником (А-Я)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Завантаження...</p>
                </div>
            ) : (
                <>
                    <div className="products-grid">
                        {currentProducts.length > 0 ? (
                            currentProducts.map(product => (
                                <div
                                    key={`${product.id}-${product.brand}`}
                                    className="product-card"
                                    id={`product-${product.id}`}
                                >
                                    <div className="product-card__image-container">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-card__image"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="product-card__info">
                                        <h3 className="product-card__name">{product.name}</h3>
                                        <p className="product-card__brand">{product.brand}</p>
                                        <p className="product-card__price">{product.price.toLocaleString()} грн</p>
                                        <button className="product-card__compare-btn">
                                            <span className="compare-icon">↔</span>
                                            Порівняти
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p className="empty-state__text">Товари відсутні за обраними критеріями</p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination__btn pagination__btn--prev"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                &larr; Попередня
                            </button>

                            <div className="pagination__pages">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`pagination__page-btn ${currentPage === page ? 'pagination__page-btn--active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="pagination__btn pagination__btn--next"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Наступна &rarr;
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CategoryPage;