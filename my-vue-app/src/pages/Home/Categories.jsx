import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../style/Categories.css';

import Samsung_S23 from "../../assets/Smartfone/Samsung_S23.jpg";
import iPad_Air from "../../assets/tablets/iPan_Air.jpg";
import Bosch_10 from "../../assets/washingMachines/Bosh_10.jpg";
import Bosch_HBJ from "../../assets/ovens/Bosch_HBJ.jpg";
import Acer_Extensa_15 from "../../assets/laptops/Acer_Extensa_15.jpg";
import Sony_65_LED from "../../assets/TV/Sony_65_LED.jpg";

const Categories = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const categories = [
        { id: 'phones', name: t('categoriess.phones'), image: Samsung_S23 },
        { id: 'tablets', name: t('categoriess.tablets'), image: iPad_Air },
        { id: 'washingMachines', name: t('categoriess.washingMachines'), image: Bosch_10 },
        { id: 'ovens', name: t('categoriess.ovens'), image: Bosch_HBJ },
        { id: 'laptops', name: t('categoriess.laptops'), image: Acer_Extensa_15 },
        { id: 'tvs', name: t('categoriess.tvs'), image: Sony_65_LED }
    ];

    return (
        <div className="categories-page">
            <h1 className="categories-title">{t('categoriess.title')}</h1>
            <div className="categories-grid">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="category-card"
                        onClick={() => navigate(`/category/${category.id}`)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${t('categoriess.view')} ${category.name}`}
                        onKeyPress={(e) => e.key === 'Enter' && navigate(`/category/${category.id}`)}
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="category-image"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                        />
                        <h3 className="category-name">{category.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;