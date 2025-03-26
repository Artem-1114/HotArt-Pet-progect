import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { AiFillHome, AiOutlineAppstore, AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import FeedbackModal from "./FeedbackModal";
import SubscriptionForm from "./SubscriptionForm"; 
import "../style/Footer.css";

const Footer = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <footer className="footer">
            <div className="footer__links">
                {/* Колонка 1: Основні посилання */}
                <div className="footer__column">
                    <h3>Меню</h3>
                    <ul>
                        <li><Link to="/"><AiFillHome /> Головна</Link></li>
                        <li><Link to="/categories"><AiOutlineAppstore /> Категорії</Link></li>
                        <li><Link to="/about"><AiOutlineInfoCircle /> Про нас</Link></li>
                        <li><Link to="/contacts"><AiOutlineMail /> Контакти</Link></li>
                    </ul>
                </div>

                {/* Колонка 2: Юридична інформація */}
                <div className="footer__column">
                    <h3>Інформація</h3>
                    <ul>
                        <li><Link to="/terms">Умови користування</Link></li>
                        <li><Link to="/privacy">Політика конфіденційності</Link></li>
                    </ul>
                </div>

                {/* Колонка 3: Контакти та зворотний зв'язок */}
                <div className="footer__column">
                    <h3>Контакти</h3>
                    <p>Телефон: +38 (044) 123-45-67</p>
                    <p>Email: support@example.com</p>
                    <button className="contact-button" onClick={() => setModalOpen(true)}>
                        Написати нам
                    </button>
                </div>

                {/* Колонка 4: Форма підписки */}
                <div className="footer__column">
                    <h3>Підписка на розсилку</h3>
                    <SubscriptionForm />
                </div>
            </div>

            {/* Соціальні мережі */}
            <div className="footer__social">
                <h3>Ми в соцмережах</h3>
                <div className="footer__social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><SiFacebook /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><SiInstagram /></a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><SiYoutube /></a>
                </div>
            </div>

            {/* Авторські права */}
            <div className="footer__bottom">
                <p>© {new Date().getFullYear()} Ваша компанія. Всі права захищені.</p>
            </div>

            {/* Модальне вікно зворотного зв'язку */}
            <FeedbackModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </footer>
    );
};

export default Footer;