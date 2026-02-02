import { useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  type UserCredential 
} from 'firebase/auth';
import { auth } from '../firebase';

interface UseFirebaseOAuthReturn {
  signInWithGoogle: () => Promise<string>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useFirebaseOAuth = (): UseFirebaseOAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async (): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Starting Google sign-in...');
      console.log('🔍 Auth instance:', auth);
      
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      console.log('🔍 Provider configured:', provider);
      console.log('🔍 Calling signInWithPopup...');
      
      const result: UserCredential = await signInWithPopup(auth, provider);
      
      console.log('✅ Sign-in successful:', result.user);
      
      const idToken = await result.user.getIdToken();
      console.log('✅ Token obtained');
      
      setLoading(false);
      return idToken;
    } catch (err: any) {
      console.error('❌ Full error object:', err);
      console.error('❌ Error code:', err.code);
      console.error('❌ Error message:', err.message);
      
      setLoading(false);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please add it to Firebase Console.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
      
      throw err;
    }
  };

  const clearError = () => setError(null);

  return { signInWithGoogle, loading, error, clearError };
};