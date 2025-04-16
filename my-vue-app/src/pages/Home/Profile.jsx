import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateEmail } from 'firebase/auth';
import '../../style/ProfilePage.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser) {
            const fetchProfile = async () => {
                try {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setProfileData({
                            username: userSnap.data().username || currentUser.email.split('@')[0],
                            firstName: userSnap.data().firstName || '',
                            lastName: userSnap.data().lastName || '',
                            phone: userSnap.data().phone || '',
                            email: currentUser.email
                        });
                    } else {
                        // Create profile if doesn't exist
                        await setDoc(userRef, {
                            username: currentUser.email.split('@')[0],
                            firstName: '',
                            lastName: '',
                            phone: '',
                            email: currentUser.email
                        });
                        setProfileData({
                            username: currentUser.email.split('@')[0],
                            firstName: '',
                            lastName: '',
                            phone: '',
                            email: currentUser.email
                        });
                    }
                } catch (err) {
                    console.error("Error fetching profile:", err);
                    setError(t('profile.fetchError'));
                } finally {
                    setLoading(false);
                }
            };

            fetchProfile();
        }
    }, [currentUser, t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const userRef = doc(db, 'users', currentUser.uid);

            // Update email if changed
            if (profileData.email !== currentUser.email) {
                await updateEmail(currentUser, profileData.email);
            }

            // Update profile data in Firestore
            await updateDoc(userRef, {
                username: profileData.username,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phone,
                email: profileData.email
            });

            setIsEditing(false);
            setError('');
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(t('profile.updateError'));
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <div className="spinner"></div>
                    <p>{t('profile.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <h1>{t('profile.title')}</h1>

            {error && <div className="profile-error">{error}</div>}

            <div className="profile-content">
                {isEditing ? (
                    <div className="profile-edit-form">
                        <div className="form-group">
                            <label>{t('profile.username')}</label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('profile.firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                value={profileData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('profile.lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                value={profileData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('profile.phone')}</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('profile.email')}</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="profile-form-actions">
                            <button
                                className="profile-btn cancel-btn"
                                onClick={() => setIsEditing(false)}
                                disabled={loading}
                            >
                                {t('profile.cancel')}
                            </button>
                            <button
                                className="profile-btn save-btn"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? t('profile.saving') : t('profile.save')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="profile-info">
                            <h2>{t('profile.welcome')}, {profileData.username}</h2>
                            <p><strong>{t('profile.name')}:</strong> {profileData.firstName} {profileData.lastName}</p>
                            <p><strong>{t('profile.email')}:</strong> {profileData.email}</p>
                            <p><strong>{t('profile.phone')}:</strong> {profileData.phone || t('profile.notProvided')}</p>
                            <p><strong>{t('profile.lastLogin')}:</strong> {new Date(currentUser.metadata.lastSignInTime).toLocaleString()}</p>
                        </div>

                        <div className="profile-actions">
                            <button
                                className="profile-btn edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                {t('profile.editProfile')}
                            </button>
                            <button className="profile-btn">
                                {t('profile.orderHistory')}
                            </button>
                            <button className="profile-btn">
                                {t('profile.settings')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;