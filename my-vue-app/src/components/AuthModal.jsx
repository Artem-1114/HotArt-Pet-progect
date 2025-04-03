import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
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

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Валідація форми
        if (!email || !password) {
            setError(t('auth.errors.requiredFields'));
            return;
        }

        if (!isLogin && password.length < 6) {
            setError(t('auth.errors.passwordLength'));
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                // Вхід
                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                if (!userCredential.user.emailVerified) {
                    await sendEmailVerification(userCredential.user);
                    setError(t('auth.errors.emailNotVerified'));
                    return;
                }

                setCurrentUser(userCredential.user);
                setSuccessMessage(t('auth.success.login'));
            } else {
                // Реєстрація
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                setCurrentUser(userCredential.user);
                setSuccessMessage(t('auth.success.registrationWithVerification'));
            }

            setTimeout(() => {
                onClose();
                resetForm();
            }, 2000);
        } catch (error) {
            console.error("Authentication error:", error);
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthError = (error) => {
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

        setError(errorMessage);
    };

    if (!isMounted) return null;

    return (
        <div className={`auth-modal-overlay ${!isOpen ? "hidden" : ""}`}>
            <div className="auth-modal">
                <button className="close-btn" onClick={onClose} aria-label={t('common.close')}>
                    <FiX />
                </button>

                <h2>{isLogin ? t('auth.login') : t('auth.register')}</h2>

                <form onSubmit={handleSubmit} noValidate>
                    <input
                        type="email"
                        placeholder={t('auth.form.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <input
                        type="password"
                        placeholder={t('auth.form.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        minLength={6}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isLoading}
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