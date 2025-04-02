import React from "react";
import { useTranslation } from 'react-i18next';
import "../style/ContactInfo.css";

const ContactInfo = () => {
    const { t } = useTranslation();

    return (
        <div className="contact-info">
            <h3>{t('contactInfo.title')}</h3>
            <p>{t('contactInfo.phone')}: +38 (099) 744-22-72</p>
            <p>Email: artem.ishe1114@gmail.com</p>
        </div>
    );
};

export default ContactInfo;