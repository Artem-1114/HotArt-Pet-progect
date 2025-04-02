import React from 'react';
import { useTranslation } from 'react-i18next';
import '../style/PriceComparisonModal.css';

const PriceComparisonModal = ({ product, storeLogos, onClose }) => {
    const { t } = useTranslation();

    if (!product) return null;

    return (
        <div className="comparison-modal">
            <div className="modal-content">
                <h3>{t('priceComparison.title', { productName: product?.name || '' })}</h3>
                <button
                    className="close-modal"
                    onClick={onClose}
                    aria-label={t('common.close')}
                >
                    &times;
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>{t('priceComparison.store')}</th>
                            <th>{t('priceComparison.price')}</th>
                            <th>{t('priceComparison.link')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.variants
                            .sort((a, b) => a.price - b.price)
                            .map((variant, i) => (
                                <tr key={i}>
                                    <td>
                                        <img
                                            src={storeLogos[variant.store]}
                                            alt={variant.store}
                                            className="store-logo-table"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/50x30?text=Store';
                                            }}
                                        />
                                        {variant.store}
                                    </td>
                                    <td>
                                        {variant.price.toLocaleString()} {t('common.currency')}
                                    </td>
                                    <td>
                                        <a
                                            href={variant.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="store-link"
                                        >
                                            {t('priceComparison.goToStore')}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PriceComparisonModal;