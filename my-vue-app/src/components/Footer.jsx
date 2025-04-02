import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { AiFillHome, AiOutlineAppstore, AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import FeedbackModal from "./FeedbackModal";
import "../style/Footer.css";

const Footer = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <footer className="footer">
            <div className="footer__links">
                {/* Колонка 1: Основні посилання */}
                <div className="footer__column">
                    <h3>{t('footer.menu')}</h3>
                    <ul>
                        <li><Link to="/"><AiFillHome /> {t('menu.home')}</Link></li>
                        <li><Link to="/categories"><AiOutlineAppstore /> {t('menu.categories')}</Link></li>
                        <li><Link to="/about"><AiOutlineInfoCircle /> {t('menu.about')}</Link></li>
                        <li><Link to="/contacts"><AiOutlineMail /> {t('menu.contacts')}</Link></li>
                    </ul>
                </div>

                {/* Колонка 2: Юридична інформація */}
                <div className="footer__column">
                    <h3>{t('footer.information')}</h3>
                    <ul>
                        <li><Link to="/terms">{t('legal.terms')}</Link></li>
                        <li><Link to="/privacy">{t('legal.privacy')}</Link></li>
                    </ul>
                </div>

                {/* Колонка 3: Контакти та зворотний зв'язок */}
                <div className="footer__column">
                    <h3>{t('footer.contacts')}</h3>
                    <p>{t('contacts.phone')}: +38 (044) 123-45-67</p>
                    <p>{t('contacts.email')}: support@example.com</p>
                    <button
                        className="contact-button"
                        onClick={() => setModalOpen(true)}
                    >
                        {t('contacts.writeUs')}
                    </button>
                </div>

                {/* Колонка 4: Перемикач мов */}
                <div className="footer__column">
                    <h3>{t('footer.language')}</h3>
                    <div className="language-switcher">
                        <div className="language-toggle">
                            <input
                                type="checkbox"
                                id="language-toggle"
                                checked={i18n.language === 'en'}
                                onChange={() => changeLanguage(i18n.language === 'uk' ? 'en' : 'uk')}
                            />
                            <label htmlFor="language-toggle">
                                <span className="uk">UA</span>
                                <span className="en">EN</span>
                                <div className="toggle-handle"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Соціальні мережі */}
            <div className="footer__social">
                <h3>{t('footer.social')}</h3>
                <div className="footer__social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <SiFacebook />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <SiInstagram />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <SiYoutube />
                    </a>
                </div>
            </div>

            {/* Авторські права */}
            <div className="footer__bottom">
                <p>
                    {t('footer.copyright', { year: new Date().getFullYear() })}
                </p>
            </div>

            {/* Модальне вікно зворотного зв'язку */}
            <FeedbackModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </footer>
    );
};

export default Footer;