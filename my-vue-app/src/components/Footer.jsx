import React, { useState, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { AiFillHome, AiOutlineAppstore, AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import FeedbackModal from "./FeedbackModal";
import "../style/Footer.css";

const SocialLink = memo(({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
        <Icon />
    </a>
));

const MenuLink = memo(({ to, icon: Icon, text }) => (
    <li>
        <Link to={to}>
            {Icon && <Icon />} {text}
        </Link>
    </li>
));

const FooterColumn = memo(({ title, children }) => (
    <div className="footer__column">
        <h3>{title}</h3>
        {children}
    </div>
));

const LanguageToggle = memo(({ isEnglish, onChange }) => (
    <div className="language-toggle">
        <input
            type="checkbox"
            id="language-toggle"
            checked={isEnglish}
            onChange={onChange}
        />
        <label htmlFor="language-toggle">
            <span className="uk">UA</span>
            <span className="en">EN</span>
            <div className="toggle-handle"></div>
        </label>
    </div>
));

const SocialLinks = memo(({ title, links }) => (
    <div className="footer__social">
        <h3>{title}</h3>
        <div className="footer__social-icons">
            {links.map((link, idx) => (
                <SocialLink
                    key={`social-${idx}`}
                    href={link.href}
                    icon={link.icon}
                />
            ))}
        </div>
    </div>
));

const Footer = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const isEnglish = i18n.language === 'en';
    const currentYear = new Date().getFullYear();

    const handleOpenModal = useCallback(() => setModalOpen(true), []);
    const handleCloseModal = useCallback(() => setModalOpen(false), []);

    const handleLanguageChange = useCallback(() => {
        i18n.changeLanguage(isEnglish ? 'uk' : 'en');
    }, [i18n, isEnglish]);

    const mainLinks = useMemo(() => [
        { to: "/", icon: AiFillHome, text: t('menu.home') },
        { to: "/categories", icon: AiOutlineAppstore, text: t('menu.categories') },
        { to: "/about", icon: AiOutlineInfoCircle, text: t('menu.about') },
        { to: "/contacts", icon: AiOutlineMail, text: t('menu.contacts') }
    ], [t]);

    const legalLinks = useMemo(() => [
        { to: "/terms", text: t('legal.terms') },
        { to: "/privacy", text: t('legal.privacy') }
    ], [t]);

    const socialLinks = useMemo(() => [
        { href: "https://facebook.com", icon: SiFacebook },
        { href: "https://instagram.com", icon: SiInstagram },
        { href: "https://youtube.com", icon: SiYoutube }
    ], []);

    return (
        <footer className="footer">
            <div className="footer__links">
                <FooterColumn title={t('footer.menu')}>
                    <ul>
                        {mainLinks.map((link, idx) => (
                            <MenuLink
                                key={`main-${idx}`}
                                to={link.to}
                                icon={link.icon}
                                text={link.text}
                            />
                        ))}
                    </ul>
                </FooterColumn>

                <FooterColumn title={t('footer.information')}>
                    <ul>
                        {legalLinks.map((link, idx) => (
                            <MenuLink
                                key={`legal-${idx}`}
                                to={link.to}
                                text={link.text}
                            />
                        ))}
                    </ul>
                </FooterColumn>

                <FooterColumn title={t('footer.contacts')}>
                    <p>{t('contacts.phone')}: +38 (044) 123-45-67</p>
                    <p>{t('contacts.email')}: support@example.com</p>
                    <button
                        className="contact-button"
                        onClick={handleOpenModal}
                    >
                        {t('contacts.writeUs')}
                    </button>
                </FooterColumn>

                <FooterColumn title={t('footer.language')}>
                    <div className="language-switcher">
                        <LanguageToggle
                            isEnglish={isEnglish}
                            onChange={handleLanguageChange}
                        />
                    </div>
                </FooterColumn>
            </div>

            <SocialLinks
                title={t('footer.social')}
                links={socialLinks}
            />

            <div className="footer__bottom">
                <p>
                    {t('footer.copyright', { year: currentYear })}
                </p>
            </div>

            <FeedbackModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </footer>
    );
};

export default memo(Footer);