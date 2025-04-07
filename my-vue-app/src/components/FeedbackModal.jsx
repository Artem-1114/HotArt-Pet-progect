import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import "../style/FeedbackModal.css";

const FeedbackModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('feedback.validation.requiredFields')),
        email: Yup.string()
            .email(t('feedback.validation.invalidEmail'))
            .required(t('feedback.validation.requiredFields')),
        message: Yup.string().required(t('feedback.validation.requiredFields'))
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: ''
        },
        validationSchema,
        onSubmit: (values, { setStatus, resetForm }) => {
            setStatus(t('feedback.successMessage'));
            setTimeout(() => {
                resetForm();
                setStatus(null);
            }, 3000);
        }
    });

    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className="modal">
                <h2>{t('feedback.title')}</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder={t('feedback.form.name')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="error-message">{formik.errors.name}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder={t('feedback.form.email')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="error-message">{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <textarea
                            name="message"
                            placeholder={t('feedback.form.message')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.message}
                        />
                        {formik.touched.message && formik.errors.message && (
                            <p className="error-message">{formik.errors.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                    >
                        {t('feedback.form.submit')}
                    </button>
                </form>
                {formik.status && <p className="modal-status">{formik.status}</p>}
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