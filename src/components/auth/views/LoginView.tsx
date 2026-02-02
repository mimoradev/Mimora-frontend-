import React, { useState, useCallback, useEffect, useRef } from 'react';
import AuthInput from '../AuthInput';
import PhoneInput from '../PhoneInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton, { EmailIcon, PhoneIcon, GoogleIcon } from '../SecondaryButton';
import OTPInput from '../OTPInput';

type LoginMethod = 'email' | 'phone';

interface LoginViewProps {
    method: LoginMethod;
    email: string;
    countryCode: string;
    phone: string;
    otp: string[];
    onEmailChange: (email: string) => void;
    onCountryCodeChange: (code: string) => void;
    onPhoneChange: (phone: string) => void;
    onOtpChange: (otp: string[]) => void;
    onSubmit: () => void;
    onSwitchMethod: () => void;
    onGoogleSignIn: () => void;
    onSignupClick: () => void;
}

// Validation helpers
const validateEmail = (email: string): string | undefined => {
    if (email.length === 0) {
        return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address';
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
    // For demo, accept any 6-digit OTP except "300759" which shows error
    if (otpString === '300759') {
        return 'Please enter a valid OTP number';
    }
    return undefined;
};

const LoginView: React.FC<LoginViewProps> = ({
    method,
    email,
    countryCode,
    phone,
    otp,
    onEmailChange,
    onCountryCodeChange,
    onPhoneChange,
    onOtpChange,
    onSubmit,
    onSwitchMethod,
    onGoogleSignIn,
    onSignupClick,
}) => {
    const [touched, setTouched] = useState({
        email: false,
        phone: false,
        otp: false,
    });
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Get validation errors
    const emailError = touched.email ? validateEmail(email) : undefined;
    const phoneError = touched.phone ? validatePhone(phone) : undefined;
    const otpError = touched.otp ? validateOtp(otp) : undefined;

    // Check if form is valid for getting OTP
    const isPhoneValid = method === 'phone' && !validatePhone(phone);
    const isEmailValid = method === 'email' && !validateEmail(email);
    const isContactValid = method === 'email' ? isEmailValid : isPhoneValid;

    // Check if OTP is complete and valid
    const isOtpComplete = otp.join('').length === 6;
    const isOtpValid = !validateOtp(otp);

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

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onEmailChange(e.target.value);
    }, [onEmailChange]);

    const handleEmailBlur = useCallback(() => {
        setTouched(prev => ({ ...prev, email: true }));
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
        // Mark relevant field as touched to show any errors
        if (method === 'email') {
            setTouched(prev => ({ ...prev, email: true }));
        } else {
            setTouched(prev => ({ ...prev, phone: true }));
        }

        if (isContactValid) {
            setOtpSent(true);
            setTimer(30);
            setCanResend(false);
        }
    }, [method, isContactValid]);

    const handleResendOtp = useCallback(() => {
        if (canResend) {
            setTimer(30);
            setCanResend(false);
            // Reset OTP
            onOtpChange(['', '', '', '', '', '']);
            setTouched(prev => ({ ...prev, otp: false }));
        }
    }, [canResend, onOtpChange]);

    const handleVerifyOtp = useCallback(() => {
        setTouched(prev => ({ ...prev, otp: true }));
        if (isOtpValid) {
            onSubmit();
        }
    }, [isOtpValid, onSubmit]);

    // Format timer as MM:SS
    const formatTimer = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="auth-view-enter">
            {/* Heading */}
            <h1 className="text-[28px] font-semibold text-[#1E1E1E] leading-tight mb-2">
                Log In
            </h1>
            <p className="text-sm text-[#6B6B6B] mb-8">
                Enter your {method === 'email' ? 'email' : 'phone number'} to continue, We'll send you a verification code
            </p>

            {/* Form */}
            <div className="space-y-4">
                {method === 'email' ? (
                    <AuthInput
                        label="Email address"
                        type="email"
                        placeholder="Eg. name@company.com"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        error={emailError}
                        disabled={otpSent}
                    />
                ) : (
                    <div onBlur={handlePhoneBlur}>
                        <PhoneInput
                            countryCode={countryCode}
                            phoneNumber={phone}
                            onCountryCodeChange={onCountryCodeChange}
                            onPhoneNumberChange={handlePhoneChange}
                            error={!otpSent ? phoneError : undefined}
                            disabled={otpSent}
                        />
                    </div>
                )}

                {/* OTP Section - appears after Get OTP is clicked */}
                {otpSent && (
                    <div className="mt-4 animate-fade-in">
                        <label className="block text-xs text-[#6B6B6B] mb-2">
                            Enter OTP (One Time Password)
                        </label>
                        <OTPInput
                            value={otp}
                            onChange={handleOtpChange}
                            error={otpError}
                            length={6}
                        />

                        {/* Timer and Resend */}
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-[#6B6B6B]">
                                {formatTimer(timer)}
                            </span>
                            <button
                                onClick={handleResendOtp}
                                disabled={!canResend}
                                className={`text-sm font-medium underline transition-colors ${canResend
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

            {/* Get OTP / Verify OTP Button */}
            <div className="mt-6">
                {!otpSent ? (
                    <PrimaryButton
                        onClick={handleGetOtp}
                        disabled={!isContactValid}
                    >
                        Get OTP
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        onClick={handleVerifyOtp}
                        disabled={!isOtpComplete}
                    >
                        Verify OTP
                    </PrimaryButton>
                )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Secondary Options */}
            <div className="space-y-3">
                <SecondaryButton
                    icon={method === 'email' ? <PhoneIcon /> : <EmailIcon />}
                    onClick={onSwitchMethod}
                >
                    Continue with {method === 'email' ? 'Phone' : 'Email'}
                </SecondaryButton>
                <SecondaryButton icon={<GoogleIcon />} onClick={onGoogleSignIn}>
                    Continue with Google
                </SecondaryButton>
            </div>

            {/* Footer Link */}
            <p className="mt-8 text-center text-sm text-[#6B6B6B]">
                Don't have an account?{' '}
                <button
                    onClick={onSignupClick}
                    className="font-semibold text-[#1E1E1E] hover:underline"
                >
                    Sign up
                </button>
            </p>
        </div>
    );
};

export default LoginView;
