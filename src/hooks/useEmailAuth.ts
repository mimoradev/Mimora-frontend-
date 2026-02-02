import { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/auth.types';

interface UseEmailAuthReturn {
  // State
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  user: User | null;
  
  // Actions
  sendOTP: (username: string, email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resetError: () => void;
  resetState: () => void;
}

export const useEmailAuth = (): UseEmailAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const sendOTP = useCallback(async (username: string, email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.sendEmailOTP({ username, email });
      setOtpSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(errorMessage);
      setOtpSent(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await authService.verifyEmailOTP({ email, otp });
      setUser(userData);
      // Optionally store user data in localStorage or context
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setOtpSent(false);
    setUser(null);
  }, []);

  return {
    isLoading,
    error,
    otpSent,
    user,
    sendOTP,
    verifyOTP,
    resetError,
    resetState,
  };
};