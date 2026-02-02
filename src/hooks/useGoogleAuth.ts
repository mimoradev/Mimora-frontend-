import { useState } from 'react';
import { useFirebaseOAuth } from './useFirebaseOAuth';
import { authService } from '../services/authService';
import type { User } from '../types/auth.types';

interface UseGoogleAuthOptions {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

interface UseGoogleAuthReturn {
  handleGoogleSignIn: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useGoogleAuth = (options?: UseGoogleAuthOptions): UseGoogleAuthReturn => {
  const { signInWithGoogle, loading, error, clearError } = useFirebaseOAuth();
  const [backendError, setBackendError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      setBackendError(null);

      console.log('🔐 Starting Google sign-in...');
      
      // Step 1: Sign in with Google via Firebase
      const firebaseToken = await signInWithGoogle();
      console.log('✅ Google sign-in successful, token received');

      // Step 2: Authenticate with backend
      console.log('📤 Sending to backend...');
      const user = await authService.authenticateWithOAuth(firebaseToken);
      console.log('✅ User authenticated:', user);

      // Step 3: Save user data
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('firebaseToken', firebaseToken);

      // Step 4: Success callback
      if (options?.onSuccess) {
        options.onSuccess(user);
      }
    } catch (err: any) {
      console.error('❌ Google sign-in failed:', err);
      const errorMessage = err.message || 'Failed to sign in with Google';
      setBackendError(errorMessage);
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
    }
  };

  return {
    handleGoogleSignIn,
    loading,
    error: error || backendError,
  };
};