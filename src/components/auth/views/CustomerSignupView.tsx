import React, { useState, useCallback, useEffect, useRef } from 'react';
import AuthInput from '../AuthInput';
import PhoneInput from '../PhoneInput';
import OTPInput from '../OTPInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton, { EmailIcon, GoogleIcon } from '../SecondaryButton';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase';
import { authService } from '@/services/authService';

interface CustomerSignupViewProps {
    fullName: string;
    countryCode: string;
    phone: string;
    otp: string[];
    onFullNameChange: (name: string) => void;
    onCountryCodeChange: (code: string) => void;
    onPhoneChange: (phone: string) => void;
    onOtpChange: (otp: string[]) => void;
    onSubmit: () => void;
    onEmailSignIn: () => void;
    onLoginClick: () => void;
}

// Validation helpers
const validateFullName = (name: string): string | undefined => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
        return 'Full name is required';
    }
    if (trimmedName.length < 2) {
        return 'Please enter your full name. Name should be at least 2 characters.';
    }
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
        return 'Name can only contain letters and spaces';
    }
    return undefined;
};

const validatePhone = (phone: string): string | undefined => {
    if (phone.length === 0) {
        return 'Mobile number is required';
    }
    if (phone.length !== 10) {
        return 'Please enter a valid phone number';
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
        return 'Please enter a valid phone number';
    }
    return undefined;
};

const validateOtp = (otp: string[]): string | undefined => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
        return 'Please enter all 6 digits';
    }
    return undefined;
};

const CustomerSignupView: React.FC<CustomerSignupViewProps> = ({
    fullName,
    countryCode,
    phone,
    otp,
    onFullNameChange,
    onCountryCodeChange,
    onPhoneChange,
    onOtpChange,
    onSubmit,
    onEmailSignIn,
    onLoginClick,
}) => {
    const [touched, setTouched] = useState({
        fullName: false,
        phone: false,
        otp: false,
    });
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    // Get validation errors
    const fullNameError = touched.fullName ? validateFullName(fullName) : undefined;
    const phoneError = touched.phone ? validatePhone(phone) : undefined;
    const otpError = touched.otp ? validateOtp(otp) : undefined;

    // Check if form is valid for getting OTP
    const isFormValid = !validateFullName(fullName) && !validatePhone(phone);

    // Check if OTP is complete and valid
    const isOtpComplete = otp.join('').length === 6;
    const isOtpValid = !validateOtp(otp);

    // Google Sign In Handler with Backend Integration
    const handleGoogleSignIn = useCallback(async () => {
        console.log('🔴 STEP 1: Button clicked');
        setGoogleLoading(true);
        setGoogleError(null);
        
        try {
            console.log('🔴 STEP 2: Auth object exists?', !!auth);
            console.log('🔴 STEP 3: Creating provider...');
            
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            console.log('🔴 STEP 4: Provider created');
            
            console.log('🔴 STEP 5: Calling signInWithPopup NOW...');
            const result = await signInWithPopup(auth, provider);
            
            console.log('🔴 STEP 6: Popup worked! User:', result.user.email);
            console.log('🔴 STEP 7: User data:', {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
            });
            
            // Get Firebase token
            console.log('🔴 STEP 8: Getting Firebase token...');
            const firebaseToken = await result.user.getIdToken();
            console.log('🔴 STEP 9: Token received:', firebaseToken.substring(0, 20) + '...');
            
            // Send to backend
            console.log('🔴 STEP 10: Sending to backend...');
            const user = await authService.authenticateWithOAuth(firebaseToken);
            console.log('🔴 STEP 11: Backend response:', user);
            
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('firebaseToken', firebaseToken);
            
            console.log('✅ SUCCESS! User authenticated:', user);
            alert(`Welcome, ${user.name || user.email}! 🎉`);
            
            // TODO: Navigate to home page
            // window.location.href = '/home';
            
        } catch (error: any) {
            console.error('❌ ERROR occurred:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);
            
            let errorMessage = 'Failed to sign in with Google';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in cancelled';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup blocked. Please allow popups for this site';
            } else if (error.code === 'auth/unauthorized-domain') {
                errorMessage = 'This domain is not authorized. Please add it to Firebase Console.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setGoogleError(errorMessage);
            alert(`Error: ${errorMessage}`);
        } finally {
            setGoogleLoading(false);
        }
    }, []);

    // Timer effect
    useEffect(() => {
        if (otpSent && timer > 0) {
            timerRef.current = setTimeout(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [otpSent, timer]);



    const handleFullNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onFullNameChange(e.target.value);
    }, [onFullNameChange]);

    const handleFullNameBlur = useCallback(() => {
        setTouched(prev => ({ ...prev, fullName: true }));
    }, []);

    const handlePhoneChange = useCallback((value: string) => {
        onPhoneChange(value);
    }, [onPhoneChange]);

    const handlePhoneBlur = useCallback(() => {
        setTouched(prev => ({ ...prev, phone: true }));
    }, []);

    const handleOtpChange = useCallback((newOtp: string[]) => {
        onOtpChange(newOtp);
        setTouched(prev => ({ ...prev, otp: true }));
    }, [onOtpChange]);

    const handleGetOtp = useCallback(() => {
        setTouched(prev => ({ ...prev, fullName: true, phone: true }));

        if (isFormValid) {
            setOtpSent(true);
            setTimer(30);
            setCanResend(false);
            onSubmit();
        }
    }, [isFormValid, onSubmit]);

    const handleResendOtp = useCallback(() => {
        if (canResend) {
            setTimer(30);
            setCanResend(false);
            onOtpChange(['', '', '', '', '', '']);
            setTouched(prev => ({ ...prev, otp: false }));
            onSubmit();
        }
    }, [canResend, onOtpChange, onSubmit]);

    const handleVerifyOtp = useCallback(() => {
        setTouched(prev => ({ ...prev, otp: true }));
        if (isOtpValid) {
            onSubmit();
        }
    }, [isOtpValid, onSubmit]);

    const formatTimer = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="auth-view-enter">
            {/* Heading */}
            <h1 className={`font-semibold text-[#1E1E1E] leading-tight mb-1 ${otpSent ? 'text-[24px]' : 'text-[28px]'}`}>
                Create your account
            </h1>
            <p className={`text-sm text-[#6B6B6B] ${otpSent ? 'mb-4' : 'mb-8'}`}>
                Join Mimora to book trusted professionals.
            </p>

            {/* Form */}
            <div className={otpSent ? 'space-y-2' : 'space-y-4'}>
                <AuthInput
                    label="Full name"
                    placeholder="Eg. Naveen Kumar"
                    value={fullName}
                    onChange={handleFullNameChange}
                    onBlur={handleFullNameBlur}
                    error={fullNameError}
                    disabled={otpSent}
                    compact={otpSent}
                />

                <div onBlur={handlePhoneBlur}>
                    <PhoneInput
                        countryCode={countryCode}
                        phoneNumber={phone}
                        onCountryCodeChange={onCountryCodeChange}
                        onPhoneNumberChange={handlePhoneChange}
                        error={!otpSent ? phoneError : undefined}
                        disabled={otpSent}
                        compact={otpSent}
                    />
                </div>

                {/* OTP Section */}
                {otpSent && (
                    <div className="mt-2 animate-fade-in">
                        <label className="block text-xs text-[#6B6B6B] mb-1">
                            Enter OTP (One Time Password)
                        </label>
                        <OTPInput
                            value={otp}
                            onChange={handleOtpChange}
                            error={otpError}
                            length={6}
                            compact
                        />

                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[#6B6B6B]">
                                {formatTimer(timer)}
                            </span>
                            <button
                                onClick={handleResendOtp}
                                disabled={!canResend}
                                className={`text-xs font-medium underline transition-colors ${
                                    canResend
                                        ? 'text-[#1E1E1E] hover:text-[#E91E63] cursor-pointer'
                                        : 'text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Account Button */}
            <div className={otpSent ? 'mt-3' : 'mt-6'}>
                {!otpSent ? (
                    <PrimaryButton onClick={handleGetOtp} disabled={!isFormValid}>
                        Create account
                    </PrimaryButton>
                ) : (
                    <PrimaryButton onClick={handleVerifyOtp} disabled={!isOtpComplete} compact>
                        Create account
                    </PrimaryButton>
                )}
            </div>

            {/* Divider */}
            <div className={`flex items-center gap-4 ${otpSent ? 'my-3' : 'my-6'}`}>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Secondary Options */}
            <div className={otpSent ? 'space-y-2' : 'space-y-3'}>
                <SecondaryButton icon={<EmailIcon />} onClick={onEmailSignIn} compact={otpSent}>
                    Sign in with Email
                </SecondaryButton>
                <SecondaryButton 
                    icon={<GoogleIcon />} 
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    compact={otpSent}
                >
                    {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                </SecondaryButton>
            </div>

            {/* Google Error Display */}
            {googleError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{googleError}</p>
                </div>
            )}

            {/* Google Loading Indicator */}
            {googleLoading && (
                <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    <span className="ml-2 text-sm text-gray-600">Signing in with Google....</span>
                </div>
            )}

            {/* Footer Link */}
            <p className={`text-center text-sm text-[#6B6B6B] ${otpSent ? 'mt-4' : 'mt-8'}`}>
                Already have an account?{' '}
                <button
                    onClick={onLoginClick}
                    className="font-semibold text-[#1E1E1E] hover:underline"
                >
                    Log in
                </button>
            </p>
        </div>
    );
};

export default CustomerSignupView;