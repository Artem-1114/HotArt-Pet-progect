import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PriceComparisonModal from '../../components/PriceComparisonModal';
import '../../style/CategoryPage.css';
import STORE_LOGOS from '../../components/STORE_LOGOS';
import { useAuth } from '../../components/AuthContext';
import { useWishlist } from '../../components/WishlistContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import CommentsSection from '../../components/CommentsSection';
import Rating from '../../components/Rating';
import categoryData from '../../data/ArrayOfCategories';

const PRODUCTS_PER_PAGE = 8;

const CategoryBrandFilter = memo(({ brands, selectedBrands, onToggle }) => {
    const { t } = useTranslation();

    return (
        <div className="category-page__brand-filter">
            <h3 className="category-page__brand-filter-title">{t('filters.brands')}:</h3>
            <div className="category-page__brand-options">
                {brands.map(brand => (
                    <label key={brand} className="category-page__brand-option">
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => onToggle(brand)}
                            aria-label={`${t('filters.toggleBrand')} ${brand}`}
                        />
                        <span className="category-page__brand-label">{brand}</span>
                    </label>
                ))}
            </div>
        </div>
    );
});

const CategorySortFilter = memo(({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="category-page__sort-filter">
            <label className="category-page__sort-label">{t('filters.sort')}:</label>
            <select
                className="category-page__sort-select"
                value={value}
                onChange={onChange}
                aria-label={t('filters.sortBy')}
            >
                <option value="default">{t('sort.default')}</option>
                <option value="price-asc">{t('sort.priceAsc')}</option>
                <option value="price-desc">{t('sort.priceDesc')}</option>
                <option value="brand">{t('sort.brand')}</option>
                <option value="rating-desc">{t('sort.ratingDesc')}</option>
            </select>
        </div>
    );
});

const CategoryPagination = memo(({ currentPage, totalPages, onPageChange }) => {
    const { t } = useTranslation();

    return (
        <div className="category-page__pagination">
            <button
                className="category-page__pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t('pagination.previous')}
            >
                &larr; {t('pagination.previous')}
            </button>

            <div className="category-page__pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={`category-page__pagination-page-btn ${currentPage === page ? 'category-page__pagination-page-btn--active' : ''}`}
                        onClick={() => onPageChange(page)}
                        aria-label={`${t('pagination.page')} ${page}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className="category-page__pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t('pagination.next')}
            >
                {t('pagination.next')} &rarr;
            </button>
        </div>
    );
});

const CategoryLoadingIndicator = memo(() => {
    const { t } = useTranslation();

    return (
        <div className="category-page__loading">
            <div className="category-page__loading-spinner"></div>
            <p className="category-page__loading-text">{t('common.loading')}</p>
        </div>
    );
});

const CategoryEmptyState = memo(() => {
    const { t } = useTranslation();

    return (
        <div className="category-page__empty">
            <p className="category-page__empty-text">{t('product.noProducts')}</p>
        </div>
    );
});

const CategoryStoreLogos = memo(({ variants }) => {
    const { t } = useTranslation();

    return (
        <div className="category-page__store-logos">
            {variants?.slice(0, 3).map((variant, i) => (
                <img
                    key={i}
                    src={STORE_LOGOS[variant.store]}
                    alt={variant.store}
                    className="category-page__store-logo"
                    title={`${variant.store}: ${variant.price.toLocaleString()} ${t('common.currency')}`}
                />
            ))}
            {variants?.length > 3 && (
                <span className="category-page__more-stores">+{variants.length - 3}</span>
            )}
        </div>
    );
});

const CategoryProductCard = memo(({ product, onCompare }) => {
    const [showComments, setShowComments] = useState(false);
    const { currentUser } = useAuth();
    const { wishlist, cart, addToWishlist, removeFromWishlist, addToCart, removeFromCart } = useWishlist();
    const { t } = useTranslation();

    const isInWishlist = useMemo(() => wishlist.includes(product.id), [wishlist, product.id]);
    const isInCart = useMemo(() => cart.includes(product.id), [cart, product.id]);

    const handleWishlistToggle = useCallback(async () => {
        if (isInWishlist) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    }, [isInWishlist, product, addToWishlist, removeFromWishlist]);

    const handleCartToggle = useCallback(async () => {
        if (isInCart) {
            await removeFromCart(product.id);
        } else {
            await addToCart(product);
        }
    }, [isInCart, product, addToCart, removeFromCart]);

    const minPrice = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return Infinity;
        return Math.min(...product.variants.map(v => v.price));
    }, [product.variants]);

    const handleCompareClick = useCallback(() => {
        if (product.variants && product.variants.length > 0) {
            onCompare(product);
        }
    }, [onCompare, product]);

    return (
        <div className="category-page__product-card" data-testid="product-card">
            <div className="category-page__product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="category-page__product-image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
                <button
                    className={`category-page__wishlist-btn ${isInWishlist ? 'category-page__wishlist-btn--active' : ''}`}
                    onClick={handleWishlistToggle}
                    aria-label={isInWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
                    data-testid="wishlist-button"
                >
                    {isInWishlist ? '❤️' : '🤍'}
                </button>
            </div>
            <div className="category-page__product-info">
                <h3 className="category-page__product-name">{product.name}</h3>
                <p className="category-page__product-brand">{product.brand}</p>

                <div className="category-page__product-rating" data-testid="product-rating">
                    <Rating
                        productId={product.id}
                        size="medium"
                        interactive={true}
                    />
                </div>

                <p className="category-page__product-price" data-testid="product-price">
                    {product.variants && product.variants.length > 0
                        ? `${t('product.fromPrice')} ${minPrice.toLocaleString()} ${t('common.currency')}`
                        : t('product.noPrice')}
                </p>

                <CategoryStoreLogos variants={product.variants} />

                <div className="category-page__product-actions">
                    <button
                        className="category-page__compare-btn"
                        onClick={handleCompareClick}
                        disabled={!product.variants || product.variants.length === 0}
                        aria-label={`${t('product.compare')} ${product.name}`}
                        data-testid="compare-button"
                    >
                        <span className="category-page__compare-icon">↔</span>
                        {t('product.compare')} ({product.variants?.length || 0})
                    </button>
                    <button
                        className={`category-page__cart-btn ${isInCart ? 'category-page__cart-btn--in-cart' : ''}`}
                        onClick={handleCartToggle}
                        data-testid="cart-button"
                    >
                        {isInCart ? t('product.inCart') : t('product.addToCart')}
                    </button>
                </div>

                <button
                    className="category-page__toggle-comments"
                    onClick={() => setShowComments(!showComments)}
                    aria-expanded={showComments}
                    aria-controls={`comments-${product.id}`}
                    data-testid="toggle-comments"
                >
                    {showComments ? t('product.hideReviews') : t('product.showReviews')}
                </button>

                {showComments && (
                    <div
                        className="category-page__product-comments"
                        id={`comments-${product.id}`}
                        data-testid="comments-section"
                    >
                        <CommentsSection
                            productId={product.id}
                            currentUser={currentUser}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

const CategoryProductsGrid = memo(({ products, onCompare }) => {
    return (
        <div className="category-page__products-grid">
            {products.length > 0 ? (
                products.map(product => (
                    <CategoryProductCard
                        key={`${product.id}-${product.brand}`}
                        product={product}
                        onCompare={onCompare}
                    />
                ))
            ) : (
                <CategoryEmptyState />
            )}
        </div>
    );
});

const CategoryPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('default');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showComparison, setShowComparison] = useState(null);

    const CATEGORY_TITLES = useMemo(() => ({
        phones: t('categories.phones'),
        tablets: t('categories.tablets'),
        washingMachines: t('categories.washingMachines'),
        ovens: t('categories.ovens'),
        laptops: t('categories.laptops'),
        tvs: t('categories.tvs')
    }), [t]);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'products'), where('category', '==', id));
            const querySnapshot = await getDocs(q);

            let firebaseProducts = [];
            if (!querySnapshot.empty) {
                firebaseProducts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    variants: doc.data().variants || [],
                    isLocal: false,
                    averageRating: doc.data().averageRating || 0
                }));
            }

            const localProducts = categoryData[id]?.map(product => ({
                ...product,
                id: `local-${product.id}`,
                variants: product.variants || [],
                isLocal: true,
                averageRating: product.averageRating || 0
            })) || [];

            const mergedProducts = [...firebaseProducts, ...localProducts];
            const uniqueProducts = mergedProducts.filter(
                (product, index, self) =>
                    index === self.findIndex(p =>
                        p.id === product.id ||
                        (p.name === product.name && p.brand === product.brand)
                    )
            );

            setProducts(uniqueProducts);
        } catch (error) {
            console.error('Error loading products:', error);
            const localProducts = categoryData[id]?.map(product => ({
                ...product,
                id: `local-${product.id}`,
                variants: product.variants || [],
                isLocal: true,
                averageRating: product.averageRating || 0
            })) || [];
            setProducts(localProducts);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProducts();
        setSelectedBrands([]);
        setSortBy('default');
        setCurrentPage(1);
    }, [id, loadProducts]);

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
                return sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
            case 'price-desc':
                return sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
            case 'brand':
                return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
            case 'rating-desc':
                return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
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
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const totalPages = useMemo(() =>
        Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
        [filteredProducts]);

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

    const handleCompare = useCallback((product) => {
        setShowComparison(product);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowComparison(null);
    }, []);

    return (
        <div className="category-page">
            <h1 className="category-page__title">{CATEGORY_TITLES[id] || t('categories.default')}</h1>

            <div className="category-page__filters">
                <CategoryBrandFilter
                    brands={uniqueBrands}
                    selectedBrands={selectedBrands}
                    onToggle={handleBrandToggle}
                />
                <CategorySortFilter
                    value={sortBy}
                    onChange={handleSortChange}
                />
            </div>

            {loading ? (
                <CategoryLoadingIndicator />
            ) : (
                <>
                    <CategoryProductsGrid
                        products={paginatedProducts}
                        onCompare={handleCompare}
                    />

                    {totalPages > 1 && (
                        <CategoryPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            {showComparison && (
                <PriceComparisonModal
                    product={showComparison}
                    storeLogos={STORE_LOGOS}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default memo(CategoryPage);