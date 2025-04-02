import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../style/Slider.css';
import Logo_rozetka from "../assets/STORE_LOGOS/rozetka-logo.png";
import comfy_logo from "../assets/STORE_LOGOS/comfy-logo.png";
import allo_logo from "../assets/STORE_LOGOS/allo_logo.png";
import Foxtrot_logo from "../assets/STORE_LOGOS/Foxtrot_logo.png";

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t } = useTranslation();

    const slides = [
        {
            title: t('slider.iphone.title'),
            image: "Slider_15_Pro_Max.jpg",
            price: t('slider.iphone.price'),
            storeLogo: Logo_rozetka,
            storeUrl: "https://rozetka.com.ua"
        },
        {
            title: t('slider.samsung.title'),
            image: "Slider_Samsung_s23_ultra.jpg",
            price: t('slider.samsung.price'),
            storeLogo: comfy_logo,
            storeUrl: "https://comfy.ua"
        },
        {
            title: t('slider.xiaomi.title'),
            image: "Slider_Xiomi_13_pro.jpg",
            price: t('slider.xiaomi.price'),
            storeLogo: allo_logo,
            storeUrl: "https://allo.ua"
        },
        {
            title: t('slider.google.title'),
            image: "Slider_Google_pixel.jpg",
            price: t('slider.google.price'),
            storeLogo: Foxtrot_logo,
            storeUrl: "https://foxtrot.com.ua"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

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
                            e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                        }}
                    />
                    <div className="slide-content">
                        <div className="store-info">
                            <img
                                src={slide.storeLogo}
                                alt={slide.storeUrl}
                                className="store-logo"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100x30?text=Store';
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
                            {t('slider.shopButton')}
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