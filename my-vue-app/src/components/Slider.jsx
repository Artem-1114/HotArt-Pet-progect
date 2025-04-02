import React, { useState, useEffect } from 'react';
import '../style/Slider.css';

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "iPhone 15 Pro (Rozetka)",
            image: "Slider_15_Pro_Max.jpg",
            price: "42 999 грн",
            storeLogo: "https://xl-static.rozetka.com.ua/assets/img/design/logo_n.svg",
            storeUrl: "https://rozetka.com.ua"
        },
        {
            title: "Samsung Galaxy S23 Ultra (Comfy)",
            image: "Slider_Samsung_s23_ultra.jpg",
            price: "47 999 грн",
            storeLogo: "https://comfy.ua/upload/static/images/logo.png",
            storeUrl: "https://comfy.ua"
        },
        {
            title: "Xiaomi 13 Pro (Allo)",
            image: "Slider_Xiomi_13_pro.jpg",
            price: "32 999 грн",
            storeLogo: "https://allo.ua/static/version2/Allo.svg",
            storeUrl: "https://allo.ua"
        },
        {
            title: "Google Pixel 8 Pro (Foxtrot)",
            image: "Slider_Google_pixel.jpg",
            price: "38 999 грн",
            storeLogo: "https://www.foxtrot.com.ua/upload/medialibrary/af1/af17d16f6c3e5d0f5b8e0e3a2e8b3b3e.svg",
            storeUrl: "https://foxtrot.com.ua"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const goToPrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="slider-container">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="product-image"
                        onError={(e) => {
                            // e.target.src = 'https://via.placeholder.com/800x400?text=Зображення+не+знайдено';
                        }}
                    />
                    <div className="slide-content">
                        <div className="store-info">
                            <img
                                src={slide.storeLogo}
                                alt={slide.storeUrl}
                                className="store-logo"
                                onError={(e) => {
                                    // e.target.src = 'https://via.placeholder.com/100x30?text=Магазин';
                                }}
                            />
                        </div>
                        <h2>{slide.title}</h2>
                        <p className="price">{slide.price}</p>
                        <a
                            href={slide.storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shop-now"
                        >
                            Перейти до магазину
                        </a>
                    </div>
                </div>
            ))}

            <button className="slider-arrow prev" onClick={goToPrev}>
                &lt;
            </button>
            <button className="slider-arrow next" onClick={goToNext}>
                &gt;
            </button>

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;