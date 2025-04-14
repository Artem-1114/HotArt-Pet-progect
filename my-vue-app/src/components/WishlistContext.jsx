import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) {
                setWishlist([]);
                setCart([]);
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setWishlist(userData.wishlist || []);
                    setCart(userData.cart || []);
                } else {
                    await setDoc(userDocRef, { wishlist: [], cart: [] });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const updateFirebase = async (field, value) => {
        if (!currentUser) return;

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, { [field]: value });
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            throw error;
        }
    };

    const addToWishlist = async (product) => {
        if (!product?.id) return;

        const updatedWishlist = [...new Set([...wishlist, product.id])];
        setWishlist(updatedWishlist);
        await updateFirebase('wishlist', updatedWishlist);
    };

    const removeFromWishlist = async (productId) => {
        const updatedWishlist = wishlist.filter(id => id !== productId);
        setWishlist(updatedWishlist);
        await updateFirebase('wishlist', updatedWishlist);
    };

    const addToCart = async (product) => {
        if (!product?.id) return;

        const updatedCart = [...new Set([...cart, product.id])];
        setCart(updatedCart);
        await updateFirebase('cart', updatedCart);
    };

    const removeFromCart = async (productId) => {
        const updatedCart = cart.filter(id => id !== productId);
        setCart(updatedCart);
        await updateFirebase('cart', updatedCart);
    };

    const clearCart = async () => {
        setCart([]);
        if (currentUser) {
            await updateFirebase('cart', []);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            cart,
            loading,
            addToWishlist,
            removeFromWishlist,
            addToCart,
            removeFromCart,
            clearCart
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}