import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

const ADMIN_EMAILS = ['artem.ishe1114@gmail.com'];

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsAdmin(checkIfAdmin(user));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const checkIfAdmin = (user) => {
        return user?.email && ADMIN_EMAILS.includes(user.email);
    };

    const value = {
        currentUser,
        setCurrentUser,
        loading,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}