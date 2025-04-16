import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc,
    getDoc
} from 'firebase/firestore';
import '../style/CommentsSection.css';

const CommentsSection = ({ productId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userProfiles, setUserProfiles] = useState({});
    const { currentUser, isAdmin } = useAuth();

    useEffect(() => {
        if (!productId) return;

        const q = query(
            collection(db, 'comments'),
            where('productId', '==', productId)
        );

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const commentsData = [];
            const profiles = {};

            // Спочатку отримуємо всі коментарі
            querySnapshot.forEach((doc) => {
                commentsData.push({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate()
                });
            });

            // Отримуємо профілі для всіх користувачів, які залишили коментарі
            for (const comment of commentsData) {
                if (!userProfiles[comment.userId]) {
                    try {
                        const userRef = doc(db, 'users', comment.userId);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            profiles[comment.userId] = {
                                username: userSnap.data().username || comment.userEmail.split('@')[0],
                                ...userSnap.data()
                            };
                        } else {
                            // Якщо профілю немає, використовуємо частину email
                            profiles[comment.userId] = {
                                username: comment.userEmail.split('@')[0]
                            };
                        }
                    } catch (error) {
                        console.error("Error fetching user profile:", error);
                        profiles[comment.userId] = {
                            username: comment.userEmail.split('@')[0]
                        };
                    }
                }
            }

            setUserProfiles(prev => ({ ...prev, ...profiles }));
            setComments(commentsData.sort((a, b) => b.timestamp - a.timestamp));
        });

        return () => unsubscribe();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        try {
            // Отримуємо поточний профіль користувача
            let username = currentUser.email.split('@')[0];
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data().username) {
                username = userSnap.data().username;
            }

            await addDoc(collection(db, 'comments'), {
                productId,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                username, // Додаємо username до коментаря
                text: newComment,
                timestamp: serverTimestamp()
            });
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей коментар?')) {
            try {
                await deleteDoc(doc(db, 'comments', commentId));
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    return (
        <div className="comments-section">
            <h3>Відгуки ({comments.length})</h3>

            {currentUser ? (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Залиште свій відгук..."
                        required
                    />
                    <button type="submit">Написати</button>
                </form>
            ) : (
                <p className="login-prompt">Увійдіть, щоб залишити відгук</p>
            )}

            <div className="comments-list">
                {comments.map((comment) => {
                    // Використовуємо username з коментаря або з профілю користувача
                    const displayName = comment.username ||
                        (userProfiles[comment.userId]?.username ||
                            comment.userEmail.split('@')[0]);

                    return (
                        <div key={comment.id} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">{displayName}</span>
                                <span className="comment-date">
                                    {comment.timestamp?.toLocaleString()}
                                </span>
                                {(currentUser?.uid === comment.userId || isAdmin) && (
                                    <button
                                        className="delete-comment"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        Видалити
                                    </button>
                                )}
                            </div>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CommentsSection;