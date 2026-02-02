import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import ProfileSelector from '../components/auth/views/ProfileSelector';
import CreateAccountView from '../components/auth/views/CreateAccountView';
import CustomerSignupView from '../components/auth/views/CustomerSignupView';
import CustomerEmailSignupView from '../components/auth/views/CustomerEmailSignupView';
import LoginView from '../components/auth/views/LoginView';
import OTPVerificationView from '../components/auth/views/OTPVerificationView';
import SuccessView from '../components/auth/views/SuccessView';
import PrimaryButton from '../components/auth/PrimaryButton';
import { useAuthFlow } from '../hooks/useAuthFlow';
import '../styles/auth.css';

const AuthPage: React.FC = () => {
    const {
        step,
        profileType,
        authMethod,
        formData,
        isEmailVerified,
        setProfileType,
        setAuthMethod,
        updateFormData,
        setEmailVerified,
        goToCreateAccount,
        goToCustomerSignup,
        goToCustomerEmailSignup,
        goToLogin,
        goToOTP,
        goToSuccess,
        setStep,
    } = useAuthFlow();

    // Profile Selection View
    if (step === 'profile-selection') {
        return (
            <AuthLayout>
                <h1 className="text-[28px] font-semibold text-[#1E1E1E] leading-tight mb-2">
                    Create or Join an Account
                </h1>
                <p className="text-sm text-[#6B6B6B] mb-8">
                    Select your profile to proceed
                </p>

                <ProfileSelector
                    selectedProfile={profileType}
                    onSelect={setProfileType}
                />

                <div className="mt-8">
                    <PrimaryButton
                        onClick={() => {
                            if (profileType === 'customer') {
                                goToLogin('phone');
                            } else {
                                goToCreateAccount();
                            }
                        }}
                        disabled={!profileType}
                    >
                        Get Started
                    </PrimaryButton>
                </div>
            </AuthLayout>
        );
    }

    // Customer Signup (Phone)
    if (step === 'signup-customer') {
        return (
            <AuthLayout>
                <CustomerSignupView
                    fullName={formData.fullName}
                    countryCode={formData.countryCode}
                    phone={formData.phone}
                    otp={formData.otp}
                    onFullNameChange={(name) => updateFormData({ fullName: name })}
                    onCountryCodeChange={(code) => updateFormData({ countryCode: code })}
                    onPhoneChange={(phone) => updateFormData({ phone })}
                    onOtpChange={(otp) => updateFormData({ otp })}
                    onSubmit={goToSuccess}
                    onEmailSignIn={goToCustomerEmailSignup}
                    onGoogleSignIn={() => console.log('Google Sign In')}
                    onLoginClick={() => goToLogin('phone')}
                />
            </AuthLayout>
        );
    }

    // Customer Signup (Email)
    if (step === 'signup-customer-email') {
        return (
            <AuthLayout>
                <CustomerEmailSignupView
                    fullName={formData.fullName}
                    email={formData.email}
                    otp={formData.otp}
                    onFullNameChange={(name) => updateFormData({ fullName: name })}
                    onEmailChange={(email) => updateFormData({ email })}
                    onOtpChange={(otp) => updateFormData({ otp })}
                    onSubmit={goToSuccess}
                    onPhoneSignIn={goToCustomerSignup}
                    onGoogleSignIn={() => console.log('Google Sign In')}
                    onLoginClick={() => goToLogin('phone')}
                />
            </AuthLayout>
        );
    }


    // Create Account View (Artist)
    if (step === 'create-account') {
        return (
            <AuthLayout>
                <CreateAccountView
                    fullName={formData.fullName}
                    countryCode={formData.countryCode}
                    phone={formData.phone}
                    onFullNameChange={(name) => updateFormData({ fullName: name })}
                    onCountryCodeChange={(code) => updateFormData({ countryCode: code })}
                    onPhoneChange={(phone) => updateFormData({ phone })}
                    onSubmit={goToOTP}
                    onSwitchToEmail={() => goToLogin('email')}
                    onGoogleSignIn={() => console.log('Google Sign In')}
                    onLoginClick={() => goToLogin('email')}
                />
            </AuthLayout>
        );
    }

    // Login with Email
    if (step === 'login-email') {
        return (
            <AuthLayout>
                <LoginView
                    method="email"
                    email={formData.email}
                    countryCode={formData.countryCode}
                    phone={formData.phone}
                    otp={formData.otp}
                    onEmailChange={(email) => updateFormData({ email })}
                    onCountryCodeChange={(code) => updateFormData({ countryCode: code })}
                    onPhoneChange={(phone) => updateFormData({ phone })}
                    onOtpChange={(otp) => updateFormData({ otp })}
                    onSubmit={goToSuccess}
                    onSwitchMethod={() => {
                        setAuthMethod('phone');
                        setStep('login-phone');
                    }}
                    onGoogleSignIn={() => console.log('Google Sign In')}
                    onSignupClick={goToCustomerSignup}
                />
            </AuthLayout>
        );
    }

    // Login with Phone
    if (step === 'login-phone') {
        return (
            <AuthLayout>
                <LoginView
                    method="phone"
                    email={formData.email}
                    countryCode={formData.countryCode}
                    phone={formData.phone}
                    otp={formData.otp}
                    onEmailChange={(email) => updateFormData({ email })}
                    onCountryCodeChange={(code) => updateFormData({ countryCode: code })}
                    onPhoneChange={(phone) => updateFormData({ phone })}
                    onOtpChange={(otp) => updateFormData({ otp })}
                    onSubmit={goToSuccess}
                    onSwitchMethod={() => {
                        setAuthMethod('email');
                        setStep('login-email');
                    }}
                    onGoogleSignIn={() => console.log('Google Sign In')}
                    onSignupClick={goToCustomerSignup}
                />
            </AuthLayout>
        );
    }

    // OTP Verification
    if (step === 'otp-verification') {
        return (
            <AuthLayout>
                <OTPVerificationView
                    method={authMethod || 'phone'}
                    fullName={formData.fullName}
                    email={formData.email}
                    countryCode={formData.countryCode}
                    phone={formData.phone}
                    otp={formData.otp}
                    isVerified={isEmailVerified}
                    onOtpChange={(otp) => updateFormData({ otp })}
                    onSubmit={() => {
                        // Simulate verification
                        setEmailVerified(true);
                        goToSuccess();
                    }}
                    onSwitchMethod={() => {
                        if (authMethod === 'email') {
                            setAuthMethod('phone');
                        } else {
                            setAuthMethod('email');
                        }
                    }}
                    onGoogleSignIn={() => console.log('Google Sign In')}
                    onLoginClick={() => goToLogin('email')}
                />
            </AuthLayout>
        );
    }

    // Success
    if (step === 'success') {
        return (
            <AuthLayout>
                <SuccessView
                    onContinue={() => {
                        // Navigate to home page
                        window.location.href = '/home';
                    }}
                />
            </AuthLayout>
        );
    }

    return null;
};

export default AuthPage;
