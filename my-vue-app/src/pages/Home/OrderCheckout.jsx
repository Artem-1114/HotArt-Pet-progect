import React, { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../components/AuthContext';
import { useWishlist } from '../../components/WishlistContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTruck, FaMoneyBillWave, FaCreditCard, FaMapMarkerAlt, FaHome, FaBoxOpen } from 'react-icons/fa';
import '../../style/OrderCheckout.css';

const OrderCheckout = () => {
    const { currentUser } = useAuth();
    const { cart, clearCart } = useWishlist();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Get totalPrice from location state or calculate it
    const [totalPrice, setTotalPrice] = useState(() => {
        // Try to get from navigation state first
        if (location.state?.totalPrice) {
            return location.state.totalPrice;
        }
        // Calculate from cart if not available in state
        return cart.reduce((total, item) => {
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            return total + (price * quantity);
        }, 0);
    });

    // Recalculate if cart changes and no price was passed
    useEffect(() => {
        if (!location.state?.totalPrice) {
            const calculatedTotal = cart.reduce((total, item) => {
                const price = item.price || 0;
                const quantity = item.quantity || 1;
                return total + (price * quantity);
            }, 0);
            setTotalPrice(calculatedTotal);
        }
    }, [cart, location.state]);

    // Load user data
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser, navigate]);

    // Validation schema
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required(t('order.validation.required'))
            .max(50, t('order.validation.maxLength', { max: 50 })),
        lastName: Yup.string()
            .required(t('order.validation.required'))
            .max(50, t('order.validation.maxLength', { max: 50 })),
        email: Yup.string()
            .email(t('order.validation.invalidEmail'))
            .required(t('order.validation.required')),
        phone: Yup.string()
            .required(t('order.validation.required'))
            .matches(/^\+?\d{10,15}$/, t('order.validation.invalidPhone')),
        deliveryMethod: Yup.string()
            .required(t('order.validation.required')),
        city: Yup.string()
            .required(t('order.validation.required'))
            .max(100, t('order.validation.maxLength', { max: 100 })),
        novaPoshtaBranch: Yup.string()
            .when('deliveryMethod', {
                is: (method) => method === 'nova_poshta',
                then: Yup.string()
                    .required(t('order.validation.required'))
                    .max(100, t('order.validation.maxLength', { max: 100 })),
            }),
        address: Yup.string()
            .when('deliveryMethod', {
                is: (method) => method === 'delivery',
                then: Yup.string()
                    .required(t('order.validation.required'))
                    .max(200, t('order.validation.maxLength', { max: 200 })),
            }),
        paymentMethod: Yup.string()
            .required(t('order.validation.required')),
        notes: Yup.string()
            .max(500, t('order.validation.maxLength', { max: 500 })),
    });

    const formik = useFormik({
        initialValues: {
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: currentUser?.email || '',
            phone: userData?.phone || '+380',
            deliveryMethod: 'nova_poshta',
            city: userData?.city || '',
            novaPoshtaBranch: userData?.novaPoshtaBranch || '',
            address: userData?.address || '',
            paymentMethod: 'cash_on_delivery',
            notes: '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setLoading(true);

                // Update user data
                const userRef = doc(db, 'users', currentUser.uid);
                await setDoc(userRef, {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phone: values.phone,
                    city: values.city,
                    ...(values.deliveryMethod === 'delivery' && { address: values.address }),
                    ...(values.deliveryMethod === 'nova_poshta' && { novaPoshtaBranch: values.novaPoshtaBranch }),
                }, { merge: true });

                // Create order
                await addDoc(collection(db, 'orders'), {
                    userId: currentUser.uid,
                    userEmail: currentUser.email,
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    })),
                    status: 'pending',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    ...values,
                    total: totalPrice,
                });

                // Clear cart
                await clearCart();

                setOrderSuccess(true);
                setTimeout(() => {
                    navigate('/profile/orders');
                }, 3000);
            } catch (error) {
                console.error('Error placing order:', error);
                setOrderError(t('order.errorPlacing'));
            } finally {
                setLoading(false);
            }
        },
    });

    if (loading && !userData) {
        return (
            <div className="order-checkout__loading">
                <div className="order-checkout__spinner"></div>
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="order-checkout__success">
                <div className="order-checkout__success-icon">
                    <FaBoxOpen />
                </div>
                <h2 className="order-checkout__success-title">{t('order.successTitle')}</h2>
                <p className="order-checkout__success-message">{t('order.successMessage')}</p>
                <p className="order-checkout__success-redirect">{t('order.redirectMessage')}</p>
            </div>
        );
    }

    return (
        <div className="order-checkout">
            <div className="order-checkout__header">
                <h1 className="order-checkout__title">{t('order.title')}</h1>
                <p className="order-checkout__subtitle">{t('order.subtitle')}</p>
            </div>

            {orderError && (
                <div className="order-checkout__error">
                    <p>{orderError}</p>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="order-checkout__form">
                <div className="order-checkout__section order-checkout__section--personal">
                    <h2 className="order-checkout__section-title">
                        <FaMapMarkerAlt className="order-checkout__section-icon" />
                        {t('order.personalInfo')}
                    </h2>

                    <div className="order-checkout__form-group order-checkout__form-group--double">
                        <div className="order-checkout__form-field">
                            <label className="order-checkout__form-label">{t('order.firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                className={`order-checkout__form-input ${formik.touched.firstName && formik.errors.firstName ? 'order-checkout__form-input--error' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.firstName}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <div className="order-checkout__form-error">{formik.errors.firstName}</div>
                            )}
                        </div>

                        <div className="order-checkout__form-field">
                            <label className="order-checkout__form-label">{t('order.lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                className={`order-checkout__form-input ${formik.touched.lastName && formik.errors.lastName ? 'order-checkout__form-input--error' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastName}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <div className="order-checkout__form-error">{formik.errors.lastName}</div>
                            )}
                        </div>
                    </div>

                    <div className="order-checkout__form-group">
                        <label className="order-checkout__form-label">{t('order.email')}</label>
                        <input
                            type="email"
                            name="email"
                            className="order-checkout__form-input order-checkout__form-input--disabled"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            disabled
                        />
                    </div>

                    <div className="order-checkout__form-group">
                        <label className="order-checkout__form-label">{t('order.phone')}</label>
                        <input
                            type="tel"
                            name="phone"
                            className={`order-checkout__form-input ${formik.touched.phone && formik.errors.phone ? 'order-checkout__form-input--error' : ''}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            placeholder="+380XXXXXXXXX"
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="order-checkout__form-error">{formik.errors.phone}</div>
                        )}
                    </div>
                </div>

                <div className="order-checkout__section order-checkout__section--delivery">
                    <h2 className="order-checkout__section-title">
                        <FaTruck className="order-checkout__section-icon" />
                        {t('order.deliveryMethod')}
                    </h2>

                    <div className="order-checkout__form-group">
                        <div className="order-checkout__radio-group">
                            <label className="order-checkout__radio-label">
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="nova_poshta"
                                    checked={formik.values.deliveryMethod === 'nova_poshta'}
                                    onChange={formik.handleChange}
                                    className="order-checkout__radio-input"
                                />
                                <span className="order-checkout__radio-custom"></span>
                                {t('order.novaPoshta')}
                            </label>

                            <label className="order-checkout__radio-label">
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="delivery"
                                    checked={formik.values.deliveryMethod === 'delivery'}
                                    onChange={formik.handleChange}
                                    className="order-checkout__radio-input"
                                />
                                <span className="order-checkout__radio-custom"></span>
                                {t('order.courierDelivery')}
                            </label>
                        </div>
                    </div>

                    <div className="order-checkout__form-group">
                        <label className="order-checkout__form-label">{t('order.city')}</label>
                        <input
                            type="text"
                            name="city"
                            className={`order-checkout__form-input ${formik.touched.city && formik.errors.city ? 'order-checkout__form-input--error' : ''}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.city}
                        />
                        {formik.touched.city && formik.errors.city && (
                            <div className="order-checkout__form-error">{formik.errors.city}</div>
                        )}
                    </div>

                    {formik.values.deliveryMethod === 'nova_poshta' && (
                        <div className="order-checkout__form-group">
                            <label className="order-checkout__form-label">{t('order.novaPoshtaBranch')}</label>
                            <input
                                type="text"
                                name="novaPoshtaBranch"
                                className={`order-checkout__form-input ${formik.touched.novaPoshtaBranch && formik.errors.novaPoshtaBranch ? 'order-checkout__form-input--error' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.novaPoshtaBranch}
                                placeholder={t('order.novaPoshtaBranchPlaceholder')}
                            />
                            {formik.touched.novaPoshtaBranch && formik.errors.novaPoshtaBranch && (
                                <div className="order-checkout__form-error">{formik.errors.novaPoshtaBranch}</div>
                            )}
                        </div>
                    )}

                    {formik.values.deliveryMethod === 'delivery' && (
                        <div className="order-checkout__form-group">
                            <label className="order-checkout__form-label">{t('order.address')}</label>
                            <input
                                type="text"
                                name="address"
                                className={`order-checkout__form-input ${formik.touched.address && formik.errors.address ? 'order-checkout__form-input--error' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.address}
                                placeholder={t('order.addressPlaceholder')}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <div className="order-checkout__form-error">{formik.errors.address}</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="order-checkout__section order-checkout__section--payment">
                    <h2 className="order-checkout__section-title">
                        {formik.values.paymentMethod === 'cash_on_delivery' ? (
                            <FaMoneyBillWave className="order-checkout__section-icon" />
                        ) : (
                            <FaCreditCard className="order-checkout__section-icon" />
                        )}
                        {t('order.paymentMethod')}
                    </h2>

                    <div className="order-checkout__form-group">
                        <div className="order-checkout__radio-group">
                            <label className="order-checkout__radio-label">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash_on_delivery"
                                    checked={formik.values.paymentMethod === 'cash_on_delivery'}
                                    onChange={formik.handleChange}
                                    className="order-checkout__radio-input"
                                />
                                <span className="order-checkout__radio-custom"></span>
                                {t('order.cashOnDelivery')}
                            </label>

                            <label className="order-checkout__radio-label">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card_online"
                                    checked={formik.values.paymentMethod === 'card_online'}
                                    onChange={formik.handleChange}
                                    className="order-checkout__radio-input"
                                />
                                <span className="order-checkout__radio-custom"></span>
                                {t('order.cardOnline')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="order-checkout__section order-checkout__section--notes">
                    <h2 className="order-checkout__section-title">
                        <FaHome className="order-checkout__section-icon" />
                        {t('order.additionalInfo')}
                    </h2>

                    <div className="order-checkout__form-group">
                        <label className="order-checkout__form-label">{t('order.notes')}</label>
                        <textarea
                            name="notes"
                            className={`order-checkout__form-textarea ${formik.touched.notes && formik.errors.notes ? 'order-checkout__form-textarea--error' : ''}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.notes}
                            placeholder={t('order.notesPlaceholder')}
                            rows="4"
                        />
                        {formik.touched.notes && formik.errors.notes && (
                            <div className="order-checkout__form-error">{formik.errors.notes}</div>
                        )}
                    </div>
                </div>

                <div className="order-checkout__summary">
                    <h2 className="order-checkout__summary-title">{t('order.summary')}</h2>

                    <div className="order-checkout__summary-items">
                        <p className="order-checkout__summary-text">
                            {t('order.itemsCount', { count: cart.length })}
                        </p>
                        <p className="order-checkout__summary-text">
                            {t('order.delivery')}: {formik.values.deliveryMethod === 'nova_poshta'
                                ? t('order.novaPoshta')
                                : t('order.courierDelivery')}
                        </p>
                    </div>

                    <div className="order-checkout__summary-total">
                        <span>{t('order.total')}:</span>
                        <span className="order-checkout__summary-price">
                            {totalPrice.toFixed(2)} {t('common.currency')}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className={`order-checkout__submit-btn ${loading || !formik.isValid ? 'order-checkout__submit-btn--disabled' : ''}`}
                        disabled={loading || !formik.isValid}
                    >
                        {loading ? (
                            <span className="order-checkout__submit-spinner"></span>
                        ) : (
                            t('order.submit')
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderCheckout;