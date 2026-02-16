import React, { useState } from 'react';
import CreateAccountView from './auth/views/CreateAccountView';
import OTPVerificationView from './auth/views/OTPVerificationView';
import { useFirebaseOTP } from '../hooks/useFirebaseOTP';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { authService } from '../services/authService';

const CreateAccountContainer: React.FC = () => {
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [backendError, setBackendError] = useState<string | null>(null);

  const { sendOTP, verifyOTP, loading: otpLoading, error: otpError, clearError: clearOtpError } = useFirebaseOTP();

  // Use the Google auth hook
  const {
    handleGoogleSignIn,
    loading: googleLoading,
    error: googleError
  } = useGoogleAuth({
    onSuccess: (user) => {
      alert(`Welcome, ${user.name || user.email}!`);
      // TODO: Navigate to home
      // navigate('/home');
    },
    onError: (error) => {
      console.error('Google auth failed:', error);
    }
  });

  const loading = otpLoading || googleLoading;
  const error = otpError || googleError || backendError;

  const handleSendOTP = async () => {
    try {
      clearOtpError();
      setBackendError(null);

      const fullPhoneNumber = `${countryCode}${phone}`;
      console.log('📱 Sending OTP to:', fullPhoneNumber);

      await sendOTP(fullPhoneNumber);
      console.log('✅ OTP sent successfully');
      setStep('otp');
    } catch (err) {
      console.error('❌ Failed to send OTP:', err);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      clearOtpError();
      setBackendError(null);

      const otpString = otp.join('');
      console.log('🔐 Verifying OTP:', otpString);

      const firebaseToken = await verifyOTP(otpString);
      console.log('✅ OTP verified, token received');

      console.log('📤 Sending to backend...');
      const user = await authService.authenticateWithOTP(
        firebaseToken,
        fullName.trim()
      );

      console.log('✅ Account created:', user);

      // Save user data
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('firebaseToken', firebaseToken);

      alert(`Welcome, ${user.name || 'User'}!`);
      // TODO: Navigate to home
      // navigate('/home');
    } catch (err: any) {
      console.error('❌ OTP authentication failed:', err);
      setBackendError(err.message || 'Failed to verify OTP');
    }
  };

  // const handleResendOTP = async () => {
  //   setOtp(Array(6).fill(''));
  //   await handleSendOTP();
  // };

  return (
    <div>
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      {step === 'signup' ? (
        <CreateAccountView
          fullName={fullName}
          countryCode={countryCode}
          phone={phone}
          onFullNameChange={setFullName}
          onCountryCodeChange={setCountryCode}
          onPhoneChange={setPhone}
          onSubmit={handleSendOTP}
          onSwitchToEmail={() => console.log('Switch to email')}
          onGoogleSignIn={handleGoogleSignIn}
          onLoginClick={() => console.log('Go to login')}
        />
      ) : (
        <OTPVerificationView
          method="phone"
          fullName={fullName}
          email=""
          countryCode={countryCode}
          phone={phone}
          otp={otp}
          isVerified={false}
          onOtpChange={setOtp}
          onSubmit={handleVerifyOTP}
          onSwitchMethod={() => setStep('signup')}
          onGoogleSignIn={handleGoogleSignIn}
          onLoginClick={() => console.log('Go to login')}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-sm text-gray-600">
            {googleLoading ? 'Signing in with Google...' : 'Processing...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CreateAccountContainer;