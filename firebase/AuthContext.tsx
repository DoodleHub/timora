import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentUser,
  onAuthStateChanged,
  resetPassword,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  updateUserProfile,
} from './auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (
    displayName?: string,
    photoURL?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signUpWithEmail(email, password, displayName);
      if (result.user) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithEmail(email, password);
      if (result.user) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const handleGoogleSignIn = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const handleAppleSignIn = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const result = await signInWithApple();
      if (result.user) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const handleSignOut = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const result = await signOutUser();
      return result;
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const handleResetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await resetPassword(email);
      return result;
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const handleUpdateProfile = async (
    displayName?: string,
    photoURL?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await updateUserProfile(displayName, photoURL);
      return result;
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle: handleGoogleSignIn,
    signInWithApple: handleAppleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
