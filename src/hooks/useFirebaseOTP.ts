import { useState } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  type ConfirmationResult 
} from 'firebase/auth';
import { auth } from '../firebase';

interface UseFirebaseOTPReturn {
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<string>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useFirebaseOTP = (): UseFirebaseOTPReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please try again.');
          }
        }
      );
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later');
      } else {
        setError(err.message || 'Failed to send OTP');
      }
      
      throw err;
    }
  };

  const verifyOTP = async (otp: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      if (!confirmationResult) {
        throw new Error('No confirmation result available');
      }

      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      
      setLoading(false);
      return idToken;
    } catch (err: any) {
      setLoading(false);
      
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one');
      } else {
        setError(err.message || 'Failed to verify OTP');
      }
      
      throw err;
    }
  };

  const clearError = () => setError(null);

  return { sendOTP, verifyOTP, loading, error, clearError };
};