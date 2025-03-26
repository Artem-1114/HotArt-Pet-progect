import React, { useState } from "react";
import "../style/FeedbackModal.css";

const FeedbackModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Валідація
        if (!name || !email || !message) {
            setStatus("Будь ласка, заповніть усі поля.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setStatus("Будь ласка, введіть коректний email.");
            return;
        }

        setTimeout(() => {
            setStatus("Повідомлення успішно надіслано!");
            setName("");
            setEmail("");
            setMessage("");
        }, 1500);
    };

    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className="modal">
                <h2>Напишіть нам</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ваше ім’я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Ваш email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <textarea
                        placeholder="Ваше повідомлення"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit">Відправити</button>
                </form>
                {status && <p className="modal-status">{status}</p>}
                <button className="modal-close" onClick={onClose}>
                    ✖
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;