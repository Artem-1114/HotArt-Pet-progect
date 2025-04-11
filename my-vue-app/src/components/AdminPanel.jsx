import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import '../style/AdminPanel.css';
import categoryData from '../data/ArrayOfCategories';

const AdminPanel = () => {
    const { currentUser, isAdmin } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [initializing, setInitializing] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!isAdmin) return;

        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    variants: doc.data().variants || []
                }));
                setProducts(productsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products: ", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isAdmin]);

    const isValidImageUrl = (url) => {
        try {
            new URL(url);
            return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
        } catch {
            return false;
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('admin.validation.required')),
        brand: Yup.string().required(t('admin.validation.required')),
        category: Yup.string().required(t('admin.validation.required')),
        image: Yup.string()
            .url(t('admin.validation.invalidUrl'))
            .required(t('admin.validation.required'))
            .test('is-image', t('admin.validation.invalidImageUrl'), value => isValidImageUrl(value)),
        variants: Yup.array().of(
            Yup.object().shape({
                store: Yup.string().required(t('admin.validation.required')),
                price: Yup.number()
                    .required(t('admin.validation.required'))
                    .positive(t('admin.validation.positivePrice'))
                    .typeError(t('admin.validation.validNumber')),
                url: Yup.string()
                    .url(t('admin.validation.invalidUrl'))
                    .required(t('admin.validation.required'))
            })
        ).min(1, t('admin.validation.minOneVariant'))
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',
            category: '',
            image: '',
            variants: [{ store: 'Rozetka', price: '', url: '' }]
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const variants = values.variants.map(variant => ({
                    ...variant,
                    price: Number(variant.price)
                }));

                const productToSave = {
                    name: values.name.trim(),
                    brand: values.brand.trim(),
                    category: values.category,
                    image: values.image.trim(),
                    variants,
                    createdAt: editingProduct ? editingProduct.createdAt : new Date(),
                    updatedAt: new Date(),
                    averageRating: editingProduct?.averageRating || 0
                };

                if (editingProduct) {
                    await updateDoc(doc(db, 'products', editingProduct.id), productToSave);
                    setSuccessMessage(t('admin.productUpdated'));
                    setProducts(products.map(p =>
                        p.id === editingProduct.id ? { ...productToSave, id: editingProduct.id } : p
                    ));
                } else {
                    const docRef = await addDoc(collection(db, 'products'), productToSave);
                    setSuccessMessage(t('admin.productAdded'));
                    setProducts([...products, { ...productToSave, id: docRef.id }]);
                }

                resetForm();
                setEditingProduct(null);
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error("Error saving product: ", error);
                setSuccessMessage(t('admin.errorSaving'));
                setTimeout(() => setSuccessMessage(''), 5000);
            }
        }
    });

    const addVariant = () => {
        formik.setFieldValue('variants', [
            ...formik.values.variants,
            { store: 'Rozetka', price: '', url: '' }
        ]);
    };

    const removeVariant = (index) => {
        const variants = [...formik.values.variants];
        variants.splice(index, 1);
        formik.setFieldValue('variants', variants);
    };

    const editProduct = (product) => {
        setEditingProduct(product);
        formik.setValues({
            name: product.name,
            brand: product.brand,
            category: product.category,
            image: product.image,
            variants: product.variants.map(v => ({
                store: v.store,
                price: v.price.toString(),
                url: v.url
            }))
        });
    };

    const deleteProduct = async (id) => {
        if (window.confirm(t('admin.confirmDelete'))) {
            try {
                await deleteDoc(doc(db, 'products', id));
                setProducts(products.filter(product => product.id !== id));
                setSuccessMessage(t('admin.productDeleted'));
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error("Error deleting product: ", error);
                setSuccessMessage(t('admin.errorDeleting'));
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        }
    };

    const initializeProducts = async () => {
        if (!window.confirm(t('admin.confirmInitialize'))) return;

        try {
            setInitializing(true);
            setSuccessMessage(t('admin.initializing'));

            // Отримуємо всі існуючі продукти
            const existingProductsSnapshot = await getDocs(collection(db, 'products'));
            const existingProductsMap = new Map();
            const uniqueProductsMap = new Map();

            // Заповнюємо мапи існуючими продуктами
            existingProductsSnapshot.forEach(doc => {
                const product = doc.data();
                const key = `${product.category}_${product.name}_${product.brand}`.toLowerCase();
                existingProductsMap.set(doc.id, product);
                uniqueProductsMap.set(key, { id: doc.id, ...product });
            });

            const batch = [];
            let addedCount = 0;
            let updatedCount = 0;
            let skippedCount = 0;

            // Обробляємо продукти з categoryData
            for (const [category, products] of Object.entries(categoryData)) {
                for (const product of products) {
                    const key = `${category}_${product.name}_${product.brand}`.toLowerCase();

                    // Якщо продукт вже існує
                    if (uniqueProductsMap.has(key)) {
                        const existingProduct = uniqueProductsMap.get(key);

                        // Перевіряємо чи варіанти відрізняються
                        if (JSON.stringify(product.variants) !== JSON.stringify(existingProduct.variants)) {
                            batch.push(updateDoc(doc(db, 'products', existingProduct.id), {
                                variants: product.variants,
                                updatedAt: new Date()
                            }));
                            updatedCount++;
                        } else {
                            skippedCount++;
                        }
                        continue;
                    }

                    // Додаємо новий продукт
                    const productToAdd = {
                        ...product,
                        category,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        averageRating: 0,
                        variants: product.variants || []
                    };

                    batch.push(addDoc(collection(db, 'products'), productToAdd));
                    uniqueProductsMap.set(key, productToAdd);
                    addedCount++;
                }
            }

            // Виконуємо всі операції
            if (batch.length > 0) {
                await Promise.all(batch);

                // Оновлюємо список продуктів
                const updatedSnapshot = await getDocs(collection(db, 'products'));
                const updatedProducts = updatedSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    variants: doc.data().variants || []
                }));

                setProducts(updatedProducts);
                setSuccessMessage(t('admin.initResults', {
                    added: addedCount,
                    updated: updatedCount,
                    skipped: skippedCount
                }));
            } else {
                setSuccessMessage(t('admin.noNewProducts'));
            }
        } catch (error) {
            console.error("Error initializing products: ", error);
            setSuccessMessage(t('admin.errorInitializing'));
        } finally {
            setInitializing(false);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    if (!isAdmin) {
        return (
            <div className="admin-panel">
                <h2>{t('admin.accessDenied')}</h2>
                <p>{t('admin.adminOnly')}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="admin-panel">
                <div className="loading-spinner"></div>
                <p>{t('admin.loading')}</p>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <h2>{t('admin.title')}</h2>

            {successMessage && (
                <div className={`success-message ${successMessage.includes('error') ? 'error' : ''}`}>
                    {successMessage}
                </div>
            )}

            <button
                onClick={initializeProducts}
                className="initialize-btn"
                disabled={initializing}
            >
                {initializing ? t('admin.initializing') : t('admin.initializeProducts')}
            </button>

            <div className="admin-form-container">
                <form onSubmit={formik.handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>{t('admin.form.name')}</label>
                        <input
                            type="text"
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="error-message">{formik.errors.name}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>{t('admin.form.brand')}</label>
                        <input
                            type="text"
                            name="brand"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.brand}
                        />
                        {formik.touched.brand && formik.errors.brand && (
                            <div className="error-message">{formik.errors.brand}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>{t('admin.form.category')}</label>
                        <select
                            name="category"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                        >
                            <option value="">{t('admin.form.selectCategory')}</option>
                            <option value="phones">{t('categories.phones')}</option>
                            <option value="tablets">{t('categories.tablets')}</option>
                            <option value="washingMachines">{t('categories.washingMachines')}</option>
                            <option value="ovens">{t('categories.ovens')}</option>
                            <option value="laptops">{t('categories.laptops')}</option>
                            <option value="tvs">{t('categories.tvs')}</option>
                        </select>
                        {formik.touched.category && formik.errors.category && (
                            <div className="error-message">{formik.errors.category}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>{t('admin.form.imageUrl')}</label>
                        <input
                            type="text"
                            name="image"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.image}
                        />
                        {formik.touched.image && formik.errors.image && (
                            <div className="error-message">{formik.errors.image}</div>
                        )}
                    </div>

                    <div className="variants-section">
                        <h3>{t('admin.form.variants')}</h3>
                        {formik.values.variants.map((variant, index) => (
                            <div key={index} className="variant-group">
                                <div className="form-group">
                                    <label>{t('admin.form.store')}</label>
                                    <select
                                        name={`variants[${index}].store`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={variant.store}
                                    >
                                        <option value="Rozetka">Rozetka</option>
                                        <option value="Comfy">Comfy</option>
                                        <option value="Allo">Allo</option>
                                        <option value="Foxtrot">Foxtrot</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>{t('admin.form.price')}</label>
                                    <input
                                        type="number"
                                        name={`variants[${index}].price`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={variant.price}
                                    />
                                    {formik.touched.variants?.[index]?.price && formik.errors.variants?.[index]?.price && (
                                        <div className="error-message">{formik.errors.variants[index].price}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>{t('admin.form.url')}</label>
                                    <input
                                        type="text"
                                        name={`variants[${index}].url`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={variant.url}
                                    />
                                    {formik.touched.variants?.[index]?.url && formik.errors.variants?.[index]?.url && (
                                        <div className="error-message">{formik.errors.variants[index].url}</div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="remove-variant-btn"
                                    onClick={() => removeVariant(index)}
                                    disabled={formik.values.variants.length <= 1}
                                >
                                    {t('admin.form.removeVariant')}
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="add-variant-btn"
                            onClick={addVariant}
                        >
                            {t('admin.form.addVariant')}
                        </button>
                    </div>

                    <button type="submit" className="submit-btn">
                        {editingProduct ? t('admin.form.updateProduct') : t('admin.form.addProduct')}
                    </button>

                    {editingProduct && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => {
                                setEditingProduct(null);
                                formik.resetForm();
                            }}
                        >
                            {t('admin.form.cancel')}
                        </button>
                    )}
                </form>
            </div>

            <div className="products-list">
                <h3>{t('admin.existingProducts')}</h3>
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="admin-product-card">
                            <div className="product-image-container">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p>{product.brand}</p>
                                <p>{t('categories.' + product.category)}</p>
                                <p>{product.variants.length} {t('admin.variants')}</p>
                                <div className="product-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => editProduct(product)}
                                    >
                                        {t('admin.edit')}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        {t('admin.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;