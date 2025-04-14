import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import '../style/CommentsSection.css';

const CommentsSection = ({ productId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { currentUser, isAdmin } = useAuth();

    useEffect(() => {
        if (!productId) return;

        const q = query(
            collection(db, 'comments'),
            where('productId', '==', productId)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsData = [];
            querySnapshot.forEach((doc) => {
                commentsData.push({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate()
                });
            });
            setComments(commentsData.sort((a, b) => b.timestamp - a.timestamp));
        });

        return () => unsubscribe();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        try {
            await addDoc(collection(db, 'comments'), {
                productId,
                userId: currentUser.uid,
                userEmail: currentUser.email,
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
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-header">
                            <span className="comment-author">{comment.userEmail}</span>
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
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;