import React, { useState, useEffect } from 'react';
import '../style/Slider.css';

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "iPhone 15 Pro (Rozetka)",
            image: "https://xl-static.rozetka.com.ua/assets/img/design/stubs/goods-stub.svg",
            price: "42 999 грн",
            storeLogo: "https://xl-static.rozetka.com.ua/assets/img/design/logo_n.svg",
            storeUrl: "https://rozetka.com.ua"
        },
        {
            title: "Samsung Galaxy S23 Ultra (Comfy)",
            image: "https://hotline.ua/img/tx/320/3205337955.jpg",
            price: "47 999 грн",
            storeLogo: "https://comfy.ua/upload/static/images/logo.png",
            storeUrl: "https://comfy.ua"
        },
        {
            title: "Xiaomi 13 Pro (Allo)",
            image: "https://i.allo.ua/media/catalog/product/cache/1/image/710x600/602f0fa2c1f0d1ba5e241f914e856ff9/1/3/138664_zoom_1.jpg",
            price: "32 999 грн",
            storeLogo: "https://allo.ua/static/version2/Allo.svg",
            storeUrl: "https://allo.ua"
        },
        {
            title: "Google Pixel 8 Pro ",
            image: "https://dzvinok.ua/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/g/o/google_pixel_8_pro_256gb_obsidian_1_.jpg",
            price: "38 999 грн",
            storeLogo: "https://hotline.ua/img/tx/320/3205370945.jpg",
            storeUrl: "https://hotline.ua"
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