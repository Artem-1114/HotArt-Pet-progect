import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import "../style/AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isMounted, setIsMounted] = useState(false);

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
            setError("Будь ласка, заповніть всі поля");
            return;
        }

        alert(isLogin ? "Успішний вхід!" : "Реєстрація успішна!");
        onClose();
    };

    if (!isMounted) return null;

    return (
        <div className={`auth-modal-overlay ${!isOpen ? "hidden" : ""}`}>
            <div className="auth-modal">
                <button className="close-btn" onClick={onClose}>
                    <FiX />
                </button>

                <h2>{isLogin ? "Увійти" : "Реєстрація"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="auth-btn">
                        {isLogin ? "Увійти" : "Зареєструватися"}
                    </button>
                </form>

                <p className="toggle-auth">
                    {isLogin ? (
                        <>Немає акаунта? <span onClick={() => setIsLogin(false)}>Зареєструватися</span></>
                    ) : (
                        <>Вже є акаунт? <span onClick={() => setIsLogin(true)}>Увійти</span></>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;