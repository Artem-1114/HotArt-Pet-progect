import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PriceComparisonModal from './PriceComparisonModal';
import rozetkaLogo from '../assets/STORE_LOGOS/rozetka-logo.png';
import comfyLogo from '../assets/STORE_LOGOS/comfy-logo.png';
import alloLogo from '../assets/STORE_LOGOS/allo_logo.png';
import foxtrotLogo from '../assets/STORE_LOGOS/Foxtrot_logo.png';
import '../style/FeaturedSection.css';

const FeaturedSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

    const storeLogos = {
        'Rozetka': rozetkaLogo,
        'Comfy': comfyLogo,
        'Allo': alloLogo,
        'Foxtrot': foxtrotLogo
    };

    useEffect(() => {
        const mockApiCall = () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        {
                            id: 1,
                            name: "iPhone 15 Pro",
                            price: 42999,
                            image: "FeaturedSection_15_Pro.jpg",
                            store: "Rozetka",
                            variants: [
                                { store: "Rozetka", price: 42999, url: "https://rozetka.com.ua/iphone-15-pro" },
                                { store: "Comfy", price: 43999, url: "https://comfy.ua/iphone-15-pro" },
                                { store: "Allo", price: 41999, url: "https://allo.ua/iphone-15-pro" },
                                { store: "Foxtrot", price: 43499, url: "https://foxtrot.com.ua/iphone-15-pro" }
                            ]
                        },
                        {
                            id: 2,
                            name: "Samsung Galaxy S23 Ultra",
                            price: 47999,
                            image: "FeaturedSection_S23_Ultra.jpg",
                            store: "Comfy",
                            variants: [
                                { store: "Rozetka", price: 46999, url: "https://rozetka.com.ua/s23-ultra" },
                                { store: "Comfy", price: 47999, url: "https://comfy.ua/s23-ultra" },
                                { store: "Allo", price: 45999, url: "https://allo.ua/s23-ultra" },
                                { store: "Foxtrot", price: 47499, url: "https://foxtrot.com.ua/s23-ultra" }
                            ]
                        },
                        {
                            id: 3,
                            name: "Xiaomi 13 Pro",
                            price: 21999,
                            image: "FeaturedSection_Xiami_13_Pro.jpg",
                            store: "Rozetka",
                            variants: [
                                { store: "Rozetka", price: 21999, url: "https://rozetka.com.ua/xiaomi-mi-11" },
                                { store: "Comfy", price: 22999, url: "https://comfy.ua/xiaomi-mi-11" },
                                { store: "Allo", price: 20999, url: "https://allo.ua/xiaomi-mi-11" },
                                { store: "Foxtrot", price: 21499, url: "https://foxtrot.com.ua/xiaomi-mi-11" }
                            ]
                        },
                        {
                            id: 4,
                            name: "Google Pixel 9 Pro",
                            price: 31566,
                            image: "FeaturedSection_Google_pixel.jpg",
                            store: "Rozetka",
                            variants: [
                                { store: "Rozetka", price: 31566, url: "https://rozetka.com.ua/google-pixel-7" },
                                { store: "Comfy", price: 30999, url: "https://comfy.ua/google-pixel-7" },
                                { store: "Allo", price: 32999, url: "https://allo.ua/google-pixel-7" },
                                { store: "Foxtrot", price: 31566, url: "https://foxtrot.com.ua/google-pixel-7" }
                            ]
                        }
                    ]);
                }, 800);
            });
        };
        mockApiCall().then(data => {
            setProducts(data);
            setLoading(false);
        }).catch(error => {
            console.error("Error loading products:", error);
            setLoading(false);
        });
    }, [t]);

    const handleCompareClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <section className="featured-section">
            <h2>{t('featuredSection.title')}</h2>
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>{t('featuredSection.loading')}</p>
                </div>
            ) : (
                <div className="featured-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <div className="price-section">
                                    <span className="price">
                                        {product.price.toLocaleString()} {t('common.currency')}
                                    </span>
                                    <span className="store-badge">{product.store}</span>
                                </div>
                                <button
                                    className="compare-btn"
                                    onClick={() => handleCompareClick(product)}
                                    aria-label={t('featuredSection.compareButton')}
                                >
                                    <span>{t('featuredSection.compareButton')}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <PriceComparisonModal
                    product={selectedProduct}
                    storeLogos={storeLogos}
                    onClose={closeModal}
                />
            )}
        </section>
    );
};

export default FeaturedSection;