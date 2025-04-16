import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../style/SalesPage.css';

const Sales = () => {
    const { t } = useTranslation();

    return (
        <div className="sales-page">
            <h1>{t('sales.title')}</h1>
            <div className="sales-container">
                <div className="sales-banner">
                    <h2>{t('sales.specialOffer')}</h2>
                    <p>{t('sales.discountText')}</p>
                    <button className="shop-now-btn">
                        {t('sales.shopNow')}
                    </button>
                </div>

                <div className="sales-list">
                    <div className="sale-item">
                        <h3>{t('sales.weekendDeal')}</h3>
                        <p>{t('sales.upToDiscount', { discount: '30%' })}</p>
                    </div>
                    <div className="sale-item">
                        <h3>{t('sales.newYearSale')}</h3>
                        <p>{t('sales.upToDiscount', { discount: '40%' })}</p>
                    </div>
                    <div className="sale-item">
                        <h3>{t('sales.clearance')}</h3>
                        <p>{t('sales.upToDiscount', { discount: '50%' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;