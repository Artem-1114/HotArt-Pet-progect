import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/Categories.css';

import Samsung_S23 from "../../assets/Smartfone/Samsung_S23.jpg";
import iPad_Air from "../../assets/tablets/iPan_Air.jpg";
import Bosch_10 from "../../assets/washingMachines/Bosh_10.jpg";
import Bosch_HBJ from "../../assets/ovens/Bosch_HBJ.jpg";
import Acer_Extensa_15 from "../../assets/laptops/Acer_Extensa_15.jpg";
import Sony_65_LED from "../../assets/TV/Sony_65_LED.jpg";

const categories = [
    { id: 'phones', name: 'Смартфони', image: Samsung_S23 },
    { id: 'tablets', name: 'Планшети', image: iPad_Air },
    { id: 'washingMachines', name: 'Пральні машини', image: Bosch_10 },
    { id: 'ovens', name: 'Духові шафи', image: Bosch_HBJ },
    { id: 'laptops', name: 'Ноутбуки', image: Acer_Extensa_15 },
    { id: 'tvs', name: 'Телевізори', image: Sony_65_LED }
];

const Categories = () => {
    const navigate = useNavigate();

    return (
        <div className="categories-page">
            <h1 className="categories-title">Категорії товарів</h1>
            <div className="categories-grid">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="category-card"
                        onClick={() => navigate(`/category/${category.id}`)}
                    >
                        <img src={category.image} alt={category.name} className="category-image" />
                        <h3 className="category-name">{category.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;