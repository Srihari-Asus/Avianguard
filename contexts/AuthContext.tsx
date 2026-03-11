import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { getUserProfile, createUserProfile, updateUserProfile } from '../services/userService';
import { UserProfile } from '../types';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrCreateProfile = async (firebaseUser: User) => {
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
            profile = await createUserProfile(firebaseUser.uid, {
                displayName: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                photoURL: firebaseUser.photoURL || '',
            });
        }
        setUserProfile(profile);
        return profile;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await fetchOrCreateProfile(firebaseUser);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        try {
            const result = await signInWithPopup(auth, provider);
            await fetchOrCreateProfile(result.user);
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                console.error('Google sign-in error:', error);
                throw error;
            }
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        setUserProfile(null);
    };

    const refreshUserProfile = async () => {
        if (user) {
            const profile = await getUserProfile(user.uid);
            if (profile) {
                setUserProfile(profile);
            }
        }
    };

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signOut,
        refreshUserProfile,
        setUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
