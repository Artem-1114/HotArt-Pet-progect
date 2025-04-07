import { useState, useEffect } from 'react'; 
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    AuthErrorCodes
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "./AuthContext";
import "../style/AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true); 
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const { setCurrentUser } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('auth.errors.invalidEmail'))
            .required(t('auth.errors.requiredFields')),
        password: Yup.string()
            .min(6, t('auth.errors.passwordLength'))
            .required(t('auth.errors.requiredFields'))
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values, { setErrors, resetForm }) => {
            setIsLoading(true);
            try {
                if (isLogin) {
                    // Login logic
                    const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);

                    if (!userCredential.user.emailVerified) {
                        await sendEmailVerification(userCredential.user);
                        setErrors({ email: t('auth.errors.emailNotVerified') });
                        return;
                    }

                    setCurrentUser(userCredential.user);
                    formik.setStatus(t('auth.success.login'));
                } else {
                    // Registration logic
                    const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                    await sendEmailVerification(userCredential.user);
                    setCurrentUser(userCredential.user);
                    formik.setStatus(t('auth.success.registrationWithVerification'));
                }

                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 2000);
            } catch (error) {
                console.error("Authentication error:", error);
                handleAuthError(error, setErrors);
            } finally {
                setIsLoading(false);
            }
        }
    });

    const handleAuthError = (error, setErrors) => {
        let errorMessage = t('auth.errors.general');

        switch (error.code) {
            case AuthErrorCodes.EMAIL_EXISTS:
                errorMessage = t('auth.errors.emailInUse');
                break;
            case AuthErrorCodes.INVALID_EMAIL:
                errorMessage = t('auth.errors.invalidEmail');
                break;
            case AuthErrorCodes.WEAK_PASSWORD:
                errorMessage = t('auth.errors.weakPassword');
                break;
            case AuthErrorCodes.USER_DELETED:
                errorMessage = t('auth.errors.userNotFound');
                break;
            case AuthErrorCodes.INVALID_PASSWORD:
                errorMessage = t('auth.errors.wrongPassword');
                break;
            case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
                errorMessage = t('auth.errors.tooManyAttempts');
                break;
            case AuthErrorCodes.NETWORK_REQUEST_FAILED:
                errorMessage = t('auth.errors.networkError');
                break;
            default:
                if (error.message.includes('email-already-in-use')) {
                    errorMessage = t('auth.errors.emailInUse');
                }
        }

        setErrors({ email: errorMessage });
    };

    const resetForm = () => {
        formik.resetForm();
        formik.setStatus('');
    };

    if (!isMounted) return null;

    return (
        <div className={`auth-modal-overlay ${!isOpen ? "hidden" : ""}`}>
            <div className="auth-modal">
                <button className="close-btn" onClick={onClose} aria-label={t('common.close')}>
                    <FiX />
                </button>

                <h2>{isLogin ? t('auth.login') : t('auth.register')}</h2>

                <form onSubmit={formik.handleSubmit} noValidate>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder={t('auth.form.email')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            disabled={isLoading}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="error-message">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder={t('auth.form.password')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            disabled={isLoading}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="error-message">{formik.errors.password}</p>
                        )}
                    </div>

                    {formik.status && <p className="success-message">{formik.status}</p>}

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isLoading || !formik.isValid}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : isLogin ? t('auth.login') : t('auth.register')}
                    </button>
                </form>

                <p className="toggle-auth">
                    {isLogin ? (
                        <>{t('auth.noAccount')} <span onClick={() => { setIsLogin(false); resetForm(); }}>{t('auth.register')}</span></>
                    ) : (
                        <>{t('auth.haveAccount')} <span onClick={() => { setIsLogin(true); resetForm(); }}>{t('auth.login')}</span></>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;