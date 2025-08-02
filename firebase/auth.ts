import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import {
  AuthError,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { FIREBASE_AUTH_CONFIG } from './config';
import { auth } from './index';

// OAuth configuration
const GOOGLE_CLIENT_ID = FIREBASE_AUTH_CONFIG.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: FIREBASE_AUTH_CONFIG.APP_SCHEME,
  path: FIREBASE_AUTH_CONFIG.APP_PATH,
});

const APPLE_CLIENT_ID = FIREBASE_AUTH_CONFIG.APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: FIREBASE_AUTH_CONFIG.APP_SCHEME,
  path: FIREBASE_AUTH_CONFIG.APP_PATH,
});

// Authentication error messages
const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return error.message || 'An error occurred during authentication.';
  }
};

// Email/Password Authentication
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<{ user: User; error?: string }> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName,
      });
    }

    return { user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    return { user: null as any, error: getAuthErrorMessage(authError) };
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User; error?: string }> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    return { user: null as any, error: getAuthErrorMessage(authError) };
  }
};

export const resetPassword = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: getAuthErrorMessage(authError) };
  }
};

// Google Authentication
export const signInWithGoogle = async (): Promise<{
  user: User;
  error?: string;
}> => {
  try {
    // For now, return an error indicating Google auth needs to be configured
    // This requires additional setup with Google Cloud Console and proper OAuth configuration
    return {
      user: null as any,
      error:
        'Google authentication is not configured. Please set up Google OAuth in the Firebase console and update the client ID in firebase/config.ts',
    };
  } catch (error) {
    console.error('Google auth error:', error);
    return {
      user: null as any,
      error: 'Google authentication failed. Please try again.',
    };
  }
};

// Apple Authentication
export const signInWithApple = async (): Promise<{
  user: User;
  error?: string;
}> => {
  try {
    // For now, return an error indicating Apple auth needs to be configured
    // This requires additional setup with Apple Developer Console and proper OAuth configuration
    return {
      user: null as any,
      error:
        'Apple authentication is not configured. Please set up Apple Sign In in the Firebase console and update the client ID in firebase/config.ts',
    };
  } catch (error) {
    console.error('Apple auth error:', error);
    return {
      user: null as any,
      error: 'Apple authentication failed. Please try again.',
    };
  }
};

// Sign Out
export const signOutUser = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await signOut(auth);
    // Clear any stored auth data
    await AsyncStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Failed to sign out. Please try again.' };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

// Update user profile
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
      return { success: true };
    }
    return { success: false, error: 'No user is currently signed in.' };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
};
