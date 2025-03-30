import React, { useState, useEffect } from 'react';
import '../style/FeaturedSection.css';

const FeaturedSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const mockApiCall = () => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        {
                            id: 1,
                            name: "iPhone 15 Pro",
                            price: "42 999 грн",
                            image: "FeaturedSection_15_Pro.jpg",
                            store: "Rozetka"
                        },
                        {
                            id: 2,
                            name: "Samsung Galaxy S23 Ultra",
                            price: "47 999 грн",
                            image: "FeaturedSection_S23_Ultra.jpg",
                            store: "Comfy"
                        },
                        {
                            id: 3,
                            name: "Xiaomi 13 Pro",
                            price: "32 999 грн",
                            image: "FeaturedSection_Xiami_13_Pro.jpg",
                            store: "Allo"
                        },
                        {
                            id: 4,
                            name: "Google Pixel 8 Pro",
                            price: "38 999 грн",
                            image: "FeaturedSection_Google_pixel.jpg",
                            store: "Foxtrot"
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
    }, []);

    return (
        <section className="featured-section">
            <h2>Акційні пропозиції</h2>
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Завантаження товарів...</p>
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
                                    <span className="price">{product.price}</span>
                                    <span className="store-badge">{product.store}</span>
                                </div>
                                <button className="compare-btn">
                                    <span>Порівняти ціни</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturedSection;