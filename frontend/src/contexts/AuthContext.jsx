import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
} from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    async function signup(email, password) {
        createUserWithEmailAndPassword(auth, email, password).then(
            (credential) => {
                setDoc(doc(db, 'users', credential.user.uid), {
                    role: 'user',
                });
            }
        );
    }

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        setRole(null);
        return signOut(auth);
    }

    async function loginWithGoogle() {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider);
    }

    async function resetPassword(email) {
        await sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setCurrentUser(currentUser);
            if (currentUser) {
                // Fetch role from Firestore when user is authenticated
                try {
                    const userDoc = await getDoc(
                        doc(db, 'users', currentUser.uid)
                    );
                    if (userDoc.exists()) {
                        setRole(userDoc.data().role);
                    } else {
                        setRole('user'); // default role
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setRole('user'); // default role on error
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loginWithGoogle,
        resetPassword,
        role,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
