import React, { useEffect, useState } from 'react';
import { useWishlist } from '../../components/WishlistContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../style/CartPage.css';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useWishlist();
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                let calculatedTotal = 0;
                const products = await Promise.all(
                    cart.map(async (productId) => {
                        if (productId.startsWith('local-')) {
                            const localId = productId.replace('local-', '');
                            const category = Object.keys(categoryData).find(cat =>
                                categoryData[cat].some(p => p.id === localId)
                            );
                            const product = categoryData[category].find(p => p.id === localId);
                            const price = product.variants?.length > 0
                                ? Math.min(...product.variants.map(v => v.price))
                                : 0;
                            calculatedTotal += price;
                            return {
                                ...product,
                                id: productId,
                                price
                            };
                        } else {
                            const productRef = doc(db, 'products', productId);
                            const productSnap = await getDoc(productRef);
                            if (!productSnap.exists()) return null;

                            const productData = productSnap.data();
                            const price = productData.variants?.length > 0
                                ? Math.min(...productData.variants.map(v => v.price))
                                : 0;
                            calculatedTotal += price;
                            return {
                                id: productSnap.id,
                                ...productData,
                                price
                            };
                        }
                    })
                );

                setCartProducts(products.filter(Boolean));
                setTotalPrice(calculatedTotal);
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartProducts();
    }, [cart]);

    const handleCheckout = () => {
        alert(t('cart.orderPlaced'));
        clearCart();
    };

    if (loading) {
        return (
            <div className="cart-page__loading">
                <div className="cart-page__spinner"></div>
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <main className="cart-page">
            <h1 className="cart-page__title">{t('cart.title')}</h1>

            {cartProducts.length === 0 ? (
                <div className="cart-page__empty">
                    <p className="cart-page__empty-text">{t('cart.empty')}</p>
                    <Link to="/categories" className="cart-page__empty-link">
                        {t('cart.goToCatalog')}
                    </Link>
                </div>
            ) : (
                <>
                    <section className="cart-page__items">
                        {cartProducts.map(product => (
                            <article key={product.id} className="cart-page__item">
                                <Link
                                    to={`/product/${product.id.replace('local-', '')}`}
                                    className="cart-page__item-link"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="cart-page__item-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                        }}
                                    />
                                    <div className="cart-page__item-info">
                                        <h3 className="cart-page__item-name">{product.name}</h3>
                                        <p className="cart-page__item-brand">{product.brand}</p>
                                    </div>
                                </Link>
                                <div className="cart-page__item-price">
                                    {product.price.toLocaleString()} {t('common.currency')}
                                </div>
                                <button
                                    onClick={() => removeFromCart(product.id)}
                                    className="cart-page__item-remove"
                                >
                                    {t('cart.remove')}
                                </button>
                            </article>
                        ))}
                    </section>

                    <section className="cart-page__summary">
                        <div className="cart-page__total">
                            <span className="cart-page__total-label">{t('cart.total')}:</span>
                            <span className="cart-page__total-value">
                                {totalPrice.toLocaleString()} {t('common.currency')}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="cart-page__checkout"
                        >
                            {t('cart.checkout')}
                        </button>
                    </section>
                </>
            )}
        </main>
    );
};

export default CartPage;