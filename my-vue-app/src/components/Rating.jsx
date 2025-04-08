import { useState } from 'react';
import { useAuth } from './AuthContext';
import '../style/Rating.css';

const Rating = ({ productId, initialRating = 0, onRate }) => {
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(initialRating);
    const { currentUser } = useAuth();

    const handleClick = (value) => {
        if (!currentUser) return;

        setRating(value);
        if (onRate) {
            onRate(productId, value);
        }
    };

    return (
        <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => currentUser && setHover(star)}
                    onMouseLeave={() => currentUser && setHover(0)}
                    disabled={!currentUser}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default Rating;