import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../style/Slider.css';
import Slider_15_Pro_Max from '../assets/Slider/Slider_15_Pro_Max.jpg';
import Slider_Google_pixel from '../assets/Slider/Slider_Google_pixel.jpg';
import Slider_Samsung_s23_ultra from '../assets/Slider/Slider_Samsung_s23_ultra.jpg';
import Slider_Xiomi_13_pro from '../assets/Slider/Slider_Xiomi_13_pro.jpg';
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
            image: Slider_15_Pro_Max,
            price: t('slider.iphone.price'),
            storeLogo: Logo_rozetka,
            storeUrl: "https://rozetka.com.ua/ua/apple-iphone-15-pro-max-256gb-natural-titanium/p387486477/"
        },
        {
            title: t('slider.samsung.title'),
            image: Slider_Samsung_s23_ultra,
            price: t('slider.samsung.price'),
            storeLogo: comfy_logo,
            storeUrl: "https://comfy.ua/ua/mobilnyj-telefon-samsung-galaxy-s23-ultra-12-256gb-green.html"
        },
        {
            title: t('slider.xiaomi.title'),
            image: Slider_Xiomi_13_pro,
            price: t('slider.xiaomi.price'),
            storeLogo: allo_logo,
            storeUrl: "https://allo.ua/ua/products/mobile/xiaomi-13-pro-12-256gb-ceramic-white.html"
        },
        {
            title: t('slider.google.title'),
            image: Slider_Google_pixel,
            price: t('slider.google.price'),
            storeLogo: Foxtrot_logo,
            storeUrl: "https://www.foxtrot.com.ua/ru/shop/mobilnye_telefony_google_pixel_8_pro_256gb_bay.html"
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

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const currentSlideData = slides[currentSlide];

    return (
        <div className="slider-container">
            <div className="slide active">
                <img
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    className="product-image"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                    }}
                />
                <div className="slide-content">
                    <div className="store-info">
                        <img
                            src={currentSlideData.storeLogo}
                            alt={currentSlideData.storeUrl}
                            className="store-logo"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x30?text=Store';
                            }}
                        />
                    </div>
                    <h2>{currentSlideData.title}</h2>
                    <p className="price">{currentSlideData.price}</p>
                    <a
                        href={currentSlideData.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shop-now"
                    >
                        {t('slider.shopButton')}
                    </a>
                </div>
            </div>

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
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;