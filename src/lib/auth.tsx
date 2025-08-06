

'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    updateProfile,
    type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { app, db } from './firebase';
import type { User, Favorite } from './types';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserImage: (imageUrl: string) => Promise<void>;
  updateUserFavorites: (favoriteItem: Favorite, isFavoriting: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth(app);

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    const idToken = await firebaseUser.getIdToken();
    await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${idToken}`,
        },
    });

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const userProfile: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userData.name || firebaseUser.displayName || 'User',
            image: userData.image || firebaseUser.photoURL || '',
            role: userData.role || 'user',
            favorites: userData.favorites || [],
        };
        setCurrentUser(userProfile);
        setIsAdmin(userProfile.role === 'admin');
    } else {
      console.warn("User profile not found in Firestore. Logging out.");
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        await fetch('/api/auth/session', { method: 'DELETE' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, fetchUserProfile]);
  
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
            return { success: false, error: "Invalid credentials. Please check your email and password."};
        }
        return { success: false, error: "An unknown error occurred during login." };
    }
  }, [auth]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update Firebase Auth profile
        await updateProfile(user, { displayName: name, photoURL: '' });

        // Create user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            name: name,
            email: email,
            role: 'user',
            favorites: [],
            image: '',
            watchHistory: [],
        });
        
        // This will trigger the onAuthStateChanged listener to fetch the full profile
        return { success: true };

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, error: 'This email address is already in use.' };
        }
        if (error.code === 'auth/weak-password') {
            return { success: false, error: 'Password should be at least 6 characters long.' };
        }
        return { success: false, error: 'An unknown error occurred during registration.' };
    }
  }, [auth]);

  const logout = async () => {
    await signOut(auth);
  };
  
  const updateUserImage = async (imageUrl: string) => {
    if (auth.currentUser) {
        try {
            await updateProfile(auth.currentUser, { photoURL: imageUrl });
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, { image: imageUrl });
            setCurrentUser(prev => prev ? { ...prev, image: imageUrl } : null);
        } catch (error: any) {
            console.error("Error updating user image:", error.message);
        }
    }
  };

  const updateUserFavorites = async (favoriteItem: Favorite, isFavoriting: boolean) => {
    if (!currentUser) return;
    
    // Client-side state update for immediate UI response
    setCurrentUser(prevUser => {
        if (!prevUser) return null;
        const currentFavorites = prevUser.favorites || [];
        const newFavorites = isFavoriting
            ? [...currentFavorites, favoriteItem]
            : currentFavorites.filter(fav => fav.id !== favoriteItem.id);
        return { ...prevUser, favorites: newFavorites };
    });

    // Server-side update
    try {
        const userDocRef = doc(db, 'users', currentUser.id);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists() && isFavoriting) {
             await setDoc(userDocRef, { favorites: [favoriteItem] });
        } else {
             await updateDoc(userDocRef, {
                favorites: isFavoriting ? arrayUnion(favoriteItem) : arrayRemove(favoriteItem)
            });
        }
    } catch (error) {
        console.error("Error updating favorites in Firestore:", error);
        // Revert client-side change on error
        setCurrentUser(prevUser => {
             if (!prevUser) return null;
             const currentFavorites = prevUser.favorites || [];
             const revertedFavorites = isFavoriting
                ? currentFavorites.filter(fav => fav.id !== favoriteItem.id)
                : [...currentFavorites, favoriteItem];
             return { ...prevUser, favorites: revertedFavorites };
        });
    }
  };
  
  const value = useMemo(() => ({ currentUser, isAdmin, loading, login, register, logout, updateUserImage, updateUserFavorites }), [currentUser, isAdmin, loading, login, register, logout, updateUserImage, updateUserFavorites]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
