import React, { useEffect, useState } from 'react';
import { useWishlist } from '../../components/WishlistContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../style/WishlistPage.css';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                const products = await Promise.all(
                    wishlist.map(async (productId) => {
                        if (productId.startsWith('local-')) {
                            const localId = productId.replace('local-', '');
                            const category = Object.keys(categoryData).find(cat =>
                                categoryData[cat].some(p => p.id === localId)
                            );
                            const product = categoryData[category].find(p => p.id === localId);
                            return {
                                ...product,
                                id: productId
                            };
                        } else {
                            const productRef = doc(db, 'products', productId);
                            const productSnap = await getDoc(productRef);
                            return productSnap.exists()
                                ? { id: productSnap.id, ...productSnap.data() }
                                : null;
                        }
                    })
                );
                setWishlistProducts(products.filter(Boolean));
            } catch (err) {
                setError(t('wishlist.error'));
                console.error('Error fetching wishlist:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlist, t]);

    if (loading) {
        return (
            <div className="wishlist-page__loading">
                <div className="wishlist-page__spinner"></div>
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wishlist-page__error">
                <p>{error}</p>
                <Link to="/" className="wishlist-page__error-link">
                    {t('common.returnHome')}
                </Link>
            </div>
        );
    }

    return (
        <main className="wishlist-page">
            <h1 className="wishlist-page__title">{t('wishlist.title')}</h1>

            {wishlistProducts.length === 0 ? (
                <div className="wishlist-page__empty">
                    <p className="wishlist-page__empty-text">{t('wishlist.empty')}</p>
                    <Link to="/categories" className="wishlist-page__empty-link">
                        {t('wishlist.goToCatalog')}
                    </Link>
                </div>
            ) : (
                <div className="wishlist-page__grid">
                    {wishlistProducts.map(product => (
                        <article key={product.id} className="wishlist-page__item">
                            <Link
                                to={`/product/${product.id.replace('local-', '')}`}
                                className="wishlist-page__item-link"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="wishlist-page__item-image"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                                    }}
                                />
                                <div className="wishlist-page__item-info">
                                    <h3 className="wishlist-page__item-name">{product.name}</h3>
                                    <p className="wishlist-page__item-brand">{product.brand}</p>
                                    {product.variants?.length > 0 && (
                                        <p className="wishlist-page__item-price">
                                            {t('wishlist.fromPrice')} {Math.min(...product.variants.map(v => v.price)).toLocaleString()} {t('common.currency')}
                                        </p>
                                    )}
                                </div>
                            </Link>
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="wishlist-page__item-remove"
                            >
                                {t('wishlist.remove')}
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
};

export default WishlistPage;