import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from '../lib/firebase.ts';

export interface DbUser {
  id: number;
  uid: string;
  email: string;
  name?: string | null;
  role: string;
  createdAt?: string;
}

interface AuthContextType {
  currentUser: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  syncUserWithBackend: (user: User, customName?: string) => Promise<DbUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user with backend in Express / Cloud SQL
  const syncUserWithBackend = async (user: User, customName?: string): Promise<DbUser | null> => {
    try {
      const token = await user.getIdToken();
      const displayName = customName || user.displayName || user.email?.split('@')[0] || 'Usuario';
      
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email || '',
          name: displayName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setDbUser(data.user);
          return data.user;
        }
      }
    } catch (err) {
      console.error('Error syncing user with database:', err);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserWithBackend(user);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleAuthProvider);
    if (result.user) {
      await syncUserWithBackend(result.user);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await syncUserWithBackend(result.user);
    }
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      await updateProfile(result.user, { displayName: name });
      await syncUserWithBackend(result.user, name);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setDbUser(null);
  };

  const getIdToken = async () => {
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        dbUser,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        getIdToken,
        syncUserWithBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
