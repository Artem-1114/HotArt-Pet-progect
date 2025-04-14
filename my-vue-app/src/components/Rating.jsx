import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import '../style/Rating.css';

const Rating = ({ productId, size = 'medium' }) => {
    const { currentUser } = useAuth();
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Розміри рейтингу
    const sizeClasses = {
        small: 'rating--small',
        medium: 'rating--medium',
        large: 'rating--large'
    };

    // Завантаження рейтингу користувача та середнього рейтингу
    useEffect(() => {
        const fetchRatings = async () => {
            try {
                // Отримання рейтингу користувача
                if (currentUser) {
                    const userRatingRef = doc(db, 'ratings', `${productId}_${currentUser.uid}`);
                    const userRatingSnap = await getDoc(userRatingRef);
                    if (userRatingSnap.exists()) {
                        setUserRating(userRatingSnap.data().rating);
                    }
                }

                // Отримання середнього рейтингу продукту
                const productRef = doc(db, 'products', productId);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists() && productSnap.data().averageRating) {
                    setAverageRating(productSnap.data().averageRating);
                }
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };

        fetchRatings();
    }, [productId, currentUser]);

    // Обробник зміни рейтингу
    const handleRatingChange = async (newRating) => {
        if (!currentUser || isLoading) return;

        setIsLoading(true);
        try {
            // Якщо користувач обрав ту саму оцінку - видаляємо її
            const shouldDeleteRating = userRating === newRating;
            const newUserRating = shouldDeleteRating ? 0 : newRating;

            // Оновлення рейтингу користувача
            const ratingRef = doc(db, 'ratings', `${productId}_${currentUser.uid}`);

            if (shouldDeleteRating) {
                await setDoc(ratingRef, {
                    deleted: true // Позначка для видалення (фактичне видалення можна зробити через Cloud Function)
                }, { merge: true });
            } else {
                await setDoc(ratingRef, {
                    productId,
                    userId: currentUser.uid,
                    userEmail: currentUser.email,
                    rating: newUserRating,
                    timestamp: new Date()
                }, { merge: true });
            }

            setUserRating(newUserRating);
            await updateAverageRating(productId);
        } catch (error) {
            console.error('Error saving rating:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Оновлення середнього рейтингу продукту
    const updateAverageRating = async (productId) => {
        try {
            const ratingsQuery = collection(db, 'ratings');
            const q = query(ratingsQuery,
                where('productId', '==', productId),
                where('deleted', '!=', true)
            );
            const querySnapshot = await getDocs(q);

            let total = 0;
            let count = 0;
            querySnapshot.forEach((doc) => {
                if (!doc.data().deleted) {
                    total += doc.data().rating;
                    count++;
                }
            });

            const newAverage = count > 0 ? (total / count) : 0;
            setAverageRating(newAverage);

            // Оновлення середнього рейтингу в продукті
            const productRef = doc(db, 'products', productId);
            await updateDoc(productRef, {
                averageRating: newAverage,
                ratingsCount: count
            });
        } catch (error) {
            console.error('Error updating average rating:', error);
        }
    };

    return (
        <div className={`rating ${sizeClasses[size]}`}>
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={`rating-star 
                            ${star <= (hoverRating || userRating) ? 'filled' : ''}
                            ${currentUser ? 'interactive' : ''}
                        `}
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => currentUser && setHoverRating(star)}
                        onMouseLeave={() => currentUser && setHoverRating(0)}
                        disabled={!currentUser || isLoading}
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        title={currentUser ? `Оцінити на ${star} зірок` : 'Увійдіть, щоб оцінити'}
                    >
                        ★
                    </button>
                ))}
            </div>
            {averageRating > 0 && (
                <span className="average-rating">
                    ({averageRating.toFixed(1)})
                </span>
            )}
        </div>
    );
};

export default Rating;