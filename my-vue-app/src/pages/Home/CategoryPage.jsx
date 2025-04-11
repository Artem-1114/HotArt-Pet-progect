import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PriceComparisonModal from '../../components/PriceComparisonModal';
import '../../style/CategoryPage.css';
import STORE_LOGOS from '../../components/STORE_LOGOS';
import { useAuth } from '../../components/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import Rating from '../../components/Rating';
import CommentsSection from '../../components/CommentsSection';
import categoryData from '../../data/ArrayOfCategories';

const PRODUCTS_PER_PAGE = 8;

// Допоміжні компоненти
const BrandFilter = memo(({ brands, selectedBrands, onToggle }) => {
    const { t } = useTranslation();

    return (
        <div className="brand-filter">
            <h3 className="brand-filter__title">{t('filters.brands')}:</h3>
            <div className="brand-filter__options">
                {brands.map(brand => (
                    <label key={brand} className="brand-option">
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => onToggle(brand)}
                            aria-label={`${t('filters.toggleBrand')} ${brand}`}
                        />
                        <span className="brand-option__label">{brand}</span>
                    </label>
                ))}
            </div>
        </div>
    );
});

const SortFilter = memo(({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="sort-filter">
            <label className="sort-filter__label">{t('filters.sort')}:</label>
            <select
                className="sort-filter__select"
                value={value}
                onChange={onChange}
                aria-label={t('filters.sortBy')}
            >
                <option value="default">{t('sort.default')}</option>
                <option value="price-asc">{t('sort.priceAsc')}</option>
                <option value="price-desc">{t('sort.priceDesc')}</option>
                <option value="brand">{t('sort.brand')}</option>
            </select>
        </div>
    );
});

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
    const { t } = useTranslation();

    return (
        <div className="pagination">
            <button
                className="pagination__btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t('pagination.previous')}
            >
                &larr; {t('pagination.previous')}
            </button>

            <div className="pagination__pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={`pagination__page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                        aria-label={`${t('pagination.page')} ${page}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className="pagination__btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t('pagination.next')}
            >
                {t('pagination.next')} &rarr;
            </button>
        </div>
    );
});

const LoadingIndicator = memo(() => {
    const { t } = useTranslation();

    return (
        <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">{t('common.loading')}</p>
        </div>
    );
});

const EmptyState = memo(() => {
    const { t } = useTranslation();

    return (
        <div className="empty-state">
            <p className="empty-state__text">{t('product.noProducts')}</p>
        </div>
    );
});

const StoreLogos = memo(({ variants }) => {
    const { t } = useTranslation();

    return (
        <div className="product-stores">
            {variants?.slice(0, 3).map((variant, i) => (
                <img
                    key={i}
                    src={STORE_LOGOS[variant.store]}
                    alt={variant.store}
                    className="store-logo"
                    title={`${variant.store}: ${variant.price.toLocaleString()} ${t('common.currency')}`}
                />
            ))}
            {variants?.length > 3 && (
                <span className="more-stores">+{variants.length - 3}</span>
            )}
        </div>
    );
});

const ProductCard = memo(({ product, onCompare }) => {
    const [showComments, setShowComments] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const { currentUser } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const productRef = doc(db, 'products', product.id);
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    const data = productSnap.data();
                    setAverageRating(data.averageRating || 0);

                    if (currentUser) {
                        const userRatingRef = doc(db, 'ratings', `${product.id}_${currentUser.uid}`);
                        const userRatingSnap = await getDoc(userRatingRef);
                        if (userRatingSnap.exists()) {
                            setUserRating(userRatingSnap.data().rating);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };

        fetchRatings();
    }, [product.id, currentUser]);

    const handleRate = async (rating) => {
        if (!currentUser) return;

        try {
            const userRatingRef = doc(db, 'ratings', `${product.id}_${currentUser.uid}`);
            await setDoc(userRatingRef, {
                productId: product.id,
                userId: currentUser.uid,
                rating
            });

            const ratingsQuery = query(collection(db, 'ratings'), where('productId', '==', product.id));
            const querySnapshot = await getDocs(ratingsQuery);

            let total = 0;
            let count = 0;
            querySnapshot.forEach((doc) => {
                total += doc.data().rating;
                count++;
            });

            const newAverage = count > 0 ? total / count : 0;
            setAverageRating(newAverage);

            const productRef = doc(db, 'products', product.id);
            await updateDoc(productRef, { averageRating: newAverage });

            setUserRating(rating);
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const minPrice = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return Infinity;
        return Math.min(...product.variants.map(v => v.price));
    }, [product.variants]);

    return (
        <div className="product-card">
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

                <div className="product-rating">
                    <Rating
                        initialRating={userRating}
                        onRate={handleRate}
                    />
                    <span className="average-rating">({averageRating.toFixed(1)})</span>
                </div>

                <p className="product-card__price">
                    {product.variants && product.variants.length > 0
                        ? `${t('product.fromPrice')} ${minPrice.toLocaleString()} ${t('common.currency')}`
                        : t('product.noPrice')}
                </p>

                <StoreLogos variants={product.variants} />

                <button
                    className="product-card__compare-btn"
                    onClick={() => onCompare(product)}
                    disabled={!product.variants || product.variants.length === 0}
                    aria-label={`${t('product.compare')} ${product.name}`}
                >
                    <span className="compare-icon">↔</span>
                    {t('product.compare')} ({product.variants?.length || 0})
                </button>

                <button
                    className="toggle-comments-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    {showComments ? t('product.hideReviews') : t('product.showReviews')}
                </button>

                {showComments && (
                    <div className="product-comments">
                        <CommentsSection productId={product.id} />
                    </div>
                )}
            </div>
        </div>
    );
});

const ProductsGrid = memo(({ products, onCompare }) => {
    return (
        <div className="products-grid">
            {products.length > 0 ? (
                products.map(product => (
                    <ProductCard
                        key={`${product.id}-${product.brand}`}
                        product={product}
                        onCompare={onCompare}
                    />
                ))
            ) : (
                <EmptyState />
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

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // Отримуємо дані з Firebase
                const q = query(collection(db, 'products'), where('category', '==', id));
                const querySnapshot = await getDocs(q);

                let firebaseProducts = [];
                if (!querySnapshot.empty) {
                    firebaseProducts = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        variants: doc.data().variants || []
                    }));
                }

                // Отримуємо локальні дані
                const localProducts = categoryData[id]?.map(product => ({
                    ...product,
                    id: product.id.toString(),
                    variants: product.variants || []
                })) || [];

                // Об'єднуємо та видаляємо дублікати
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
                // Використовуємо лише локальні дані у разі помилки
                const localProducts = categoryData[id]?.map(product => ({
                    ...product,
                    id: product.id.toString(),
                    variants: product.variants || []
                })) || [];
                setProducts(localProducts);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
        setSelectedBrands([]);
        setSortBy('default');
        setCurrentPage(1);
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
                return sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
            case 'price-desc':
                return sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
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

            <div className="category-filters">
                <BrandFilter
                    brands={uniqueBrands}
                    selectedBrands={selectedBrands}
                    onToggle={handleBrandToggle}
                />
                <SortFilter
                    value={sortBy}
                    onChange={handleSortChange}
                />
            </div>

            {loading ? (
                <LoadingIndicator />
            ) : (
                <>
                    <ProductsGrid
                        products={paginatedProducts}
                        onCompare={handleCompare}
                    />

                    {totalPages > 1 && (
                        <Pagination
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