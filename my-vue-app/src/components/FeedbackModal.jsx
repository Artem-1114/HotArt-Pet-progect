import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "../style/FeedbackModal.css";

const FeedbackModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);
    const { t } = useTranslation();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Валідація форми
        if (!name || !email || !message) {
            setStatus(t('feedback.validation.requiredFields'));
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setStatus(t('feedback.validation.invalidEmail'));
            return;
        }

        setTimeout(() => {
            setStatus(t('feedback.successMessage'));
            setName("");
            setEmail("");
            setMessage("");
        }, 1500);
    };

    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className="modal">
                <h2>{t('feedback.title')}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder={t('feedback.form.name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder={t('feedback.form.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <textarea
                        placeholder={t('feedback.form.message')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit">{t('feedback.form.submit')}</button>
                </form>
                {status && <p className="modal-status">{status}</p>}
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label={t('common.close')}
                >
                    ✖
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;