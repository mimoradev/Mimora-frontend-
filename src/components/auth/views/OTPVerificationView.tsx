import React from 'react';
import AuthInput from '../AuthInput';
import PhoneInput from '../PhoneInput';
import OTPInput from '../OTPInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton, { EmailIcon, PhoneIcon, GoogleIcon } from '../SecondaryButton';

type VerificationMethod = 'email' | 'phone';

interface OTPVerificationViewProps {
    method: VerificationMethod;
    fullName: string;
    email: string;
    countryCode: string;
    phone: string;
    otp: string[];
    isVerified: boolean;
    onOtpChange: (otp: string[]) => void;
    onSubmit: () => void;
    onSwitchMethod: () => void;
    onGoogleSignIn: () => void;
    onLoginClick: () => void;
}

const OTPVerificationView: React.FC<OTPVerificationViewProps> = ({
    method,
    fullName,
    email,
    countryCode,
    phone,
    otp,
    isVerified,
    onOtpChange,
    onSubmit,
    onSwitchMethod,
    onGoogleSignIn,
    onLoginClick,
}) => {
    const isOtpComplete = otp.every(digit => digit !== '');

    return (
        <div className="auth-view-enter">
            {/* Heading */}
            <h1 className="text-[28px] font-semibold text-[#1E1E1E] leading-tight mb-2">
                Create your account
            </h1>
            <p className="text-sm text-[#6B6B6B] mb-8">
                Join Mimora to book trusted professionals.
            </p>

            {/* Form Fields (Read-only for verification) */}
            <div className="space-y-4">
                <AuthInput
                    label="Full name"
                    value={fullName}
                    disabled
                    className="bg-gray-50"
                />

                {method === 'email' ? (
                    <AuthInput
                        label="Email address"
                        value={email}
                        disabled
                        className="bg-gray-50"
                        rightElement={
                            isVerified ? (
                                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <circle cx="7" cy="7" r="7" fill="#22C55E" />
                                        <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Verified
                                </span>
                            ) : (
                                <button className="text-xs font-semibold text-[#1E1E1E] hover:underline">
                                    Verify
                                </button>
                            )
                        }
                    />
                ) : (
                    <PhoneInput
                        countryCode={countryCode}
                        phoneNumber={phone}
                        onCountryCodeChange={() => { }}
                        onPhoneNumberChange={() => { }}
                        disabled
                    />
                )}

                {/* OTP Input */}
                <OTPInput
                    value={otp}
                    onChange={onOtpChange}
                />
            </div>

            {/* Create Account / Verify Button */}
            <div className="mt-6">
                <PrimaryButton
                    onClick={onSubmit}
                    disabled={!isOtpComplete}
                >
                    {isVerified ? 'Create account' : 'Verify OTP'}
                </PrimaryButton>
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
                    Sign in with {method === 'email' ? 'Phone' : 'Email'}
                </SecondaryButton>
                <SecondaryButton icon={<GoogleIcon />} onClick={onGoogleSignIn}>
                    Sign in with Google
                </SecondaryButton>
            </div>

            {/* Footer Link */}
            <p className="mt-8 text-center text-sm text-[#6B6B6B]">
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

export default OTPVerificationView;
