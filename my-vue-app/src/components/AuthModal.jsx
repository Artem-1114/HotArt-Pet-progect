import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useTranslation } from 'react-i18next';
import "../style/AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError(t('auth.validation.requiredFields'));
            return;
        }

        alert(isLogin ? t('auth.success.login') : t('auth.success.registration'));
        onClose();
    };

    if (!isMounted) return null;

    return (
        <div className={`auth-modal-overlay ${!isOpen ? "hidden" : ""}`}>
            <div className="auth-modal">
                <button className="close-btn" onClick={onClose} aria-label={t('common.close')}>
                    <FiX />
                </button>

                <h2>{isLogin ? t('auth.login') : t('auth.register')}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder={t('auth.form.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder={t('auth.form.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="auth-btn">
                        {isLogin ? t('auth.login') : t('auth.register')}
                    </button>
                </form>

                <p className="toggle-auth">
                    {isLogin ? (
                        <>{t('auth.noAccount')} <span onClick={() => setIsLogin(false)}>{t('auth.register')}</span></>
                    ) : (
                        <>{t('auth.haveAccount')} <span onClick={() => setIsLogin(true)}>{t('auth.login')}</span></>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;