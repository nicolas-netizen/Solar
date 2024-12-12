import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './config';

interface AuthResponse {
  user: FirebaseUser | null;
  error: string | null;
}

// Register new user
export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Sign in existing user
export const signInUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Sign out user
export const signOutUser = async (): Promise<{ error: string | null }> => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export { auth };
