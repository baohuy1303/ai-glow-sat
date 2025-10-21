import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    sendEmailVerification,
    reload,
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
    const [emailVerified, setEmailVerified] = useState(false);

    async function signup(email, password) {
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', credential.user.uid), {
                role: 'user',
                email: email,
            });
            await sendEmailVerification(credential.user);
            return credential;
        } catch (error) {
            throw error;
        }
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

    async function resendVerificationEmail() {
        if (currentUser && !currentUser.emailVerified) {
            await sendEmailVerification(currentUser);
        }
    }

    async function checkEmailVerification() {
        if (currentUser) {
            await reload(currentUser);
            setEmailVerified(currentUser.emailVerified);
            return currentUser.emailVerified;
        }
        return false;
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
                    // Firebase automatically tracks email verification status
                    setEmailVerified(currentUser.emailVerified);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setRole('user'); // default role on error
                    setEmailVerified(false);
                }
            } else {
                setRole(null);
                setEmailVerified(false);
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
        resendVerificationEmail,
        checkEmailVerification,
        role,
        emailVerified,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
