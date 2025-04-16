import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../style/StoresPage.css';

// Імпорт логотипів магазинів
import RozetkaLogo from '../../assets/STORE_LOGOS/rozetka-logo.png';
import ComfyLogo from '../../assets/STORE_LOGOS/comfy-logo.png';
import AlloLogo from '../../assets/STORE_LOGOS/allo_logo.png';
import FoxtrotLogo from '../../assets/STORE_LOGOS/Foxtrot_logo.png';

const Stores = () => {
    const { t } = useTranslation();

    // Дані про магазини
    const stores = [
        {
            id: 1,
            name: 'Rozetka',
            logo: RozetkaLogo,
            description: t('stores.rozetkaDesc'),
            website: 'https://rozetka.com.ua',
            rating: 4.8
        },
        {
            id: 2,
            name: 'Comfy',
            logo: ComfyLogo,
            description: t('stores.comfyDesc'),
            website: 'https://comfy.ua',
            rating: 4.7
        },
        {
            id: 3,
            name: 'Allo',
            logo: AlloLogo,
            description: t('stores.alloDesc'),
            website: 'https://allo.ua',
            rating: 4.5
        },
        {
            id: 4,
            name: 'Foxtrot',
            logo: FoxtrotLogo,
            description: t('stores.foxtrotDesc'),
            website: 'https://foxtrot.com.ua',
            rating: 4.6
        }
    ];

    return (
        <div className="stores-page">
            <h1>{t('stores.title')}</h1>
            <p className="stores-intro">{t('stores.introText')}</p>

            <div className="stores-grid">
                {stores.map(store => (
                    <div key={store.id} className="store-card">
                        <div className="store-header">
                            <img
                                src={store.logo}
                                alt={store.name}
                                className="store-logo"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150x50?text=Store+Logo';
                                }}
                            />
                            <div className="store-rating">
                                ⭐ {store.rating}
                            </div>
                        </div>
                        <div className="store-body">
                            <h3>{store.name}</h3>
                            <p>{store.description}</p>
                        </div>
                        <div className="store-footer">
                            <a
                                href={store.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="store-link"
                            >
                                {t('stores.visitWebsite')}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stores;