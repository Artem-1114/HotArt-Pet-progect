
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PriceComparisonModal from './PriceComparisonModal';

import rozetkaLogo from '../assets/STORE_LOGOS/rozetka-logo.png';
import comfyLogo from '../assets/STORE_LOGOS/comfy-logo.png';
import alloLogo from '../assets/STORE_LOGOS/allo_logo.png';
import foxtrotLogo from '../assets/STORE_LOGOS/Foxtrot_logo.png';

import iphone15ProImage from "../assets/Smartfone/iPhone_15_pro.jpg";
import googlePixelImage from "../assets/Actions/FeaturedSection_Google_pixel.jpg";
import s23UltraImage from "../assets/Actions/FeaturedSection_S23_Ultra.jpg";
import xiaomi13ProImage from "../assets/Actions/FeaturedSection_Xiami_13_Pro.jpg";

import '../style/FeaturedSection.css';

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 42999,
        image: iphone15ProImage,
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
        image: s23UltraImage,
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
        image: xiaomi13ProImage,
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
        image: googlePixelImage,
        store: "Rozetka",
        variants: [
            { store: "Rozetka", price: 31566, url: "https://rozetka.com.ua/google-pixel-7" },
            { store: "Comfy", price: 30999, url: "https://comfy.ua/google-pixel-7" },
            { store: "Allo", price: 32999, url: "https://allo.ua/google-pixel-7" },
            { store: "Foxtrot", price: 31566, url: "https://foxtrot.com.ua/google-pixel-7" }
        ]
    }
];

const ProductCard = React.memo(({ product, onCompareClick, currencyLabel }) => {
    return (
        <div className="product-card">
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
                        {product.price.toLocaleString()} {currencyLabel}
                    </span>
                    <span className="store-badge">{product.store}</span>
                </div>
                <button
                    className="compare-btn"
                    onClick={() => onCompareClick(product)}
                >
                    <span>Порівняти ціни</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>
        </div>
    );
});

const LoadingSpinner = React.memo(({ loadingText }) => (
    <div className="loading">
        <div className="spinner"></div>
        <p>{loadingText}</p>
    </div>
));

const FeaturedSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

    const storeLogos = useMemo(() => ({
        'Rozetka': rozetkaLogo,
        'Comfy': comfyLogo,
        'Allo': alloLogo,
        'Foxtrot': foxtrotLogo
    }), []);

    useEffect(() => {
        const mockApiCall = () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(MOCK_PRODUCTS);
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
    }, []);

    const handleCompareClick = useCallback((product) => {
        setSelectedProduct(product);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
    }, []);

    return (
        <section className="featured-section">
            <h2>{t('featuredSection.title')}</h2>

            {loading ? (
                <LoadingSpinner loadingText={t('featuredSection.loading')} />
            ) : (
                <div className="featured-grid">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onCompareClick={handleCompareClick}
                            currencyLabel={t('common.currency')}
                        />
                    ))}
                </div>
            )}

            {showModal && selectedProduct && (
                <PriceComparisonModal
                    product={selectedProduct}
                    storeLogos={storeLogos}
                    onClose={closeModal}
                />
            )}
        </section>
    );
};

export default React.memo(FeaturedSection);