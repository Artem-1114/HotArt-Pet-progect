import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import categoryData from '../../components/ArrayOfCategories';
import PriceComparisonModal from '../../components/PriceComparisonModal';
import '../../style/CategoryPage.css';
import STORE_LOGOS from '../../components/STORE_LOGOS';

const PRODUCTS_PER_PAGE = 8;

const CategoryPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showComparison, setShowComparison] = useState(null);

    const CATEGORY_TITLES = {
        phones: t('categories.phones'),
        tablets: t('categories.tablets'),
        washingMachines: t('categories.washingMachines'),
        ovens: t('categories.ovens'),
        laptops: t('categories.laptops'),
        tvs: t('categories.tvs')
    };

    useEffect(() => {
        const loadProducts = () => {
            setLoading(true);
            setTimeout(() => {
                setProducts(categoryData[id] || []);
                setLoading(false);
            }, 800);
        };
        loadProducts();
    }, [id]);

    const uniqueBrands = useMemo(() => {
        const brands = new Set();
        products.forEach(product => brands.add(product.brand));
        return Array.from(brands).sort();
    }, [products]);

    const getMinPrice = useCallback((product) => {
        if (!product.variants || product.variants.length === 0) return Infinity;
        return Math.min(...product.variants.map(v => v.price));
    }, []);

    const sortedProducts = useMemo(() => {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => {
                    const priceA = getMinPrice(a);
                    const priceB = getMinPrice(b);
                    if (priceA === Infinity && priceB === Infinity) return 0;
                    if (priceA === Infinity) return 1;
                    if (priceB === Infinity) return -1;
                    return priceA - priceB;
                });
            case 'price-desc':
                return sorted.sort((a, b) => {
                    const priceA = getMinPrice(a);
                    const priceB = getMinPrice(b);
                    if (priceA === Infinity && priceB === Infinity) return 0;
                    if (priceA === Infinity) return 1;
                    if (priceB === Infinity) return -1;
                    return priceB - priceA;
                });
            case 'brand':
                return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
            default:
                return sorted;
        }
    }, [products, sortBy, getMinPrice]);

    const filteredProducts = useMemo(() => {
        return selectedBrands.length === 0
            ? sortedProducts
            : sortedProducts.filter(product => selectedBrands.includes(product.brand));
    }, [sortedProducts, selectedBrands]);

    const paginatedProducts = useMemo(() => {
        const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
        const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
        return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const handleBrandToggle = useCallback((brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
        setCurrentPage(1);
    }, []);

    const handleSortChange = useCallback((e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const renderProductCard = (product) => (
        <div key={`${product.id}-${product.brand}`} className="product-card">
            <div className="product-card__image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
            </div>
            <div className="product-card__info">
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__brand">{product.brand}</p>
                <p className="product-card__price">
                    {product.variants && product.variants.length > 0
                        ? `${t('product.fromPrice')} ${getMinPrice(product).toLocaleString()} ${t('common.currency')}`
                        : t('product.noPrice')}
                </p>
                <div className="product-stores">
                    {product.variants?.slice(0, 3).map((variant, i) => (
                        <img
                            key={i}
                            src={STORE_LOGOS[variant.store]}
                            alt={variant.store}
                            className="store-logo"
                            title={`${variant.store}: ${variant.price.toLocaleString()} ${t('common.currency')}`}
                        />
                    ))}
                    {product.variants?.length > 3 && (
                        <span className="more-stores">+{product.variants.length - 3}</span>
                    )}
                </div>
                <button
                    className="product-card__compare-btn"
                    onClick={() => setShowComparison(product)}
                    disabled={!product.variants || product.variants.length === 0}
                    aria-label={`${t('product.compare')} ${product.name}`}
                >
                    <span className="compare-icon">↔</span>
                    {t('product.compare')} ({product.variants?.length || 0})
                </button>
            </div>
        </div>
    );

    const renderPagination = () => (
        <div className="pagination">
            <button
                className="pagination__btn pagination__btn--prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t('pagination.previous')}
            >
                &larr; {t('pagination.previous')}
            </button>

            <div className="pagination__pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={`pagination__page-btn ${currentPage === page ? 'pagination__page-btn--active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`${t('pagination.page')} ${page}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className="pagination__btn pagination__btn--next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t('pagination.next')}
            >
                {t('pagination.next')} &rarr;
            </button>
        </div>
    );

    return (
        <div className="category-page" id="category-page">
            <h1 className="category-page__title">{CATEGORY_TITLES[id] || t('categories.default')}</h1>

            <div className="category-filters">
                <div className="brand-filter">
                    <h3 className="brand-filter__title">{t('filters.brands')}:</h3>
                    <div className="brand-filter__options">
                        {uniqueBrands.map(brand => (
                            <label key={brand} className="brand-option">
                                <input
                                    type="checkbox"
                                    className="brand-option__checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandToggle(brand)}
                                    aria-label={`${ t('filters.toggleBrand') } ${ brand }`}
                                />
                                <span className="brand-option__label">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="sort-filter">
                    <label className="sort-filter__label">{t('filters.sort')}:</label>
                    <select
                        className="sort-filter__select"
                        value={sortBy}
                        onChange={handleSortChange}
                        aria-label={t('filters.sortBy')}
                    >
                        <option value="default">{t('sort.default')}</option>
                        <option value="price-asc">{t('sort.priceAsc')}</option>
                        <option value="price-desc">{t('sort.priceDesc')}</option>
                        <option value="brand">{t('sort.brand')}</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">{t('common.loading')}</p>
                </div>
            ) : (
                <>
                    <div className="products-grid">
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map(renderProductCard)
                        ) : (
                            <div className="empty-state">
                                <p className="empty-state__text">{t('product.noProducts')}</p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && renderPagination()}
                </>
            )}

            {showComparison && (
                <PriceComparisonModal
                    product={showComparison}
                    storeLogos={STORE_LOGOS}
                    onClose={() => setShowComparison(null)}
                />
            )}
        </div>
    );
};

export default CategoryPage;