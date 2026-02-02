import React, { useState, useCallback } from 'react';
import AuthInput from '../AuthInput';
import PhoneInput from '../PhoneInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton, { EmailIcon, GoogleIcon } from '../SecondaryButton';

interface CreateAccountViewProps {
    fullName: string;
    countryCode: string;
    phone: string;
    onFullNameChange: (name: string) => void;
    onCountryCodeChange: (code: string) => void;
    onPhoneChange: (phone: string) => void;
    onSubmit: () => void;
    onSwitchToEmail: () => void;
    onGoogleSignIn: () => void;
    onLoginClick: () => void;
}

// Validation helpers
const validateFullName = (name: string): string | undefined => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
        return 'Full name is required';
    }
    if (trimmedName.length < 2) {
        return 'Name must be at least 2 characters';
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
        return 'Mobile number must be exactly 10 digits';
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
        return 'Please enter a valid Indian mobile number';
    }
    return undefined;
};

const CreateAccountView: React.FC<CreateAccountViewProps> = ({
    fullName,
    countryCode,
    phone,
    onFullNameChange,
    onCountryCodeChange,
    onPhoneChange,
    onSubmit,
    onSwitchToEmail,
    onGoogleSignIn,
    onLoginClick,
}) => {
    const [touched, setTouched] = useState({
        fullName: false,
        phone: false,
    });

    // Get validation errors
    const fullNameError = touched.fullName ? validateFullName(fullName) : undefined;
    const phoneError = touched.phone ? validatePhone(phone) : undefined;

    // Check if form is valid
    const isFormValid = !validateFullName(fullName) && !validatePhone(phone);

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

    const handleSubmit = useCallback(() => {
        // Mark all fields as touched to show any errors
        setTouched({ fullName: true, phone: true });

        if (isFormValid) {
            onSubmit();
        }
    }, [isFormValid, onSubmit]);

    return (
        <div className="auth-view-enter">
            {/* Heading */}
            <h1 className="text-[28px] font-semibold text-[#1E1E1E] leading-tight mb-2">
                Create your account
            </h1>
            <p className="text-sm text-[#6B6B6B] mb-8">
                Join Mimora to book trusted professionals.
            </p>

            {/* Form */}
            <div className="space-y-4">
                <AuthInput
                    label="Full name"
                    placeholder="Eg. Naveen Kumar"
                    value={fullName}
                    onChange={handleFullNameChange}
                    onBlur={handleFullNameBlur}
                    error={fullNameError}
                />

                <div onBlur={handlePhoneBlur}>
                    <PhoneInput
                        countryCode={countryCode}
                        phoneNumber={phone}
                        onCountryCodeChange={onCountryCodeChange}
                        onPhoneNumberChange={handlePhoneChange}
                        error={phoneError}
                    />
                </div>
            </div>

            {/* Create Account Button */}
            <div className="mt-6">
                <PrimaryButton
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    Create account
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
                <SecondaryButton icon={<EmailIcon />} onClick={onSwitchToEmail}>
                    Sign in with Email
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

export default CreateAccountView;
