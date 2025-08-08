
'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import type { User, Favorite } from './types';
import { getUserByEmail, getUserById, getUsers, setUsers } from './localStorage';
import { useToast } from '@/hooks/use-toast';

const SESSION_KEY = 'session_user_id';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserImage: (imageUrl: string) => Promise<void>;
  updateUserFavorites: (favoriteItem: Favorite, isFavoriting: boolean) => Promise<void>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const userId = window.localStorage.getItem(SESSION_KEY);
    if (userId) {
      const user = getUserById(userId);
      if (user) {
        setCurrentUser(user);
        setIsAdmin(user.role === 'admin');
      } else {
        // Clear stale session key if user not found
        window.localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = getUserByEmail(email);
    if (user && user.password === password) {
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      window.localStorage.setItem(SESSION_KEY, user.id);
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Please check your email and password." };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'This email address is already in use.' };
    }
    if (password.length < 6) {
        return { success: false, error: 'Password should be at least 6 characters long.' };
    }

    const newUser: User = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      password,
      role: 'user',
      image: '',
      favorites: [],
      watchHistory: [],
    };

    const users = getUsers();
    setUsers([...users, newUser]);

    // Automatically log in the new user
    setCurrentUser(newUser);
    setIsAdmin(false);
    window.localStorage.setItem(SESSION_KEY, newUser.id);
    
    return { success: true };
  }, []);

  const logout = async () => {
    setCurrentUser(null);
    setIsAdmin(false);
    window.localStorage.removeItem(SESSION_KEY);
  };
  
  const updateUserImage = async (imageUrl: string) => {
    if (currentUser) {
        const updatedUser = { ...currentUser, image: imageUrl };
        const users = getUsers().map(u => u.id === currentUser.id ? updatedUser : u);
        setUsers(users);
        setCurrentUser(updatedUser);
    }
  };

  const updateUserFavorites = async (favoriteItem: Favorite, isFavoriting: boolean) => {
    if (!currentUser) return;
    
    const currentFavorites = currentUser.favorites || [];
    const newFavorites = isFavoriting
        ? [...currentFavorites, favoriteItem]
        : currentFavorites.filter(fav => fav.id !== favoriteItem.id);
        
    const updatedUser = { ...currentUser, favorites: newFavorites };
    const users = getUsers().map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(users);
    setCurrentUser(updatedUser);

    toast({
        title: isFavoriting ? "Added to Favorites" : "Removed from Favorites",
        description: `The ${favoriteItem.type} has been ${isFavoriting ? 'added to' : 'removed from'} your favorites.`,
    })
  };
  
  const value = useMemo(() => ({ currentUser, isAdmin, loading, login, register, logout, updateUserImage, updateUserFavorites, setCurrentUser }), [currentUser, isAdmin, loading, login, register, logout, updateUserImage, updateUserFavorites, setCurrentUser]);

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
