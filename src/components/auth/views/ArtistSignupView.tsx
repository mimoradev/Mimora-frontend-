import React from 'react';
import SuccessAnimation from '@/components/common/SuccessAnimation';
import { ArtistSignupProvider, useArtistSignup } from '../artist/ArtistSignupContext';
import { SetupHub, PersonalDetailsStep, BookingModesStep, PortfolioStep, BankDetailsStep } from '../artist/steps';

// ─── Inner Router (consumes context) ─────────────────────────────────
const ArtistSignupRouter: React.FC = () => {
    const { formStep, showSuccess, setShowSuccess, setFormStep, navigate } = useArtistSignup();

    if (formStep === 'portfolio') {
        return (
            <>
                <PortfolioStep />
                <SuccessAnimation
                    isVisible={showSuccess}
                    message="Portfolio Saved!"
                    subMessage="Returning to setup..."
                    onComplete={() => { setShowSuccess(false); setFormStep('method-select'); }}
                />
            </>
        );
    }

    if (formStep === 'bank-details') {
        return (
            <>
                <BankDetailsStep />
                <SuccessAnimation
                    isVisible={showSuccess}
                    message="Profile Completed!"
                    subMessage="Redirecting to home..."
                    onComplete={() => { navigate('/artist/home'); }}
                />
            </>
        );
    }

    if (formStep === 'booking-modes') {
        return (
            <>
                <BookingModesStep />
                <SuccessAnimation
                    isVisible={showSuccess}
                    message="Booking Mode Saved!"
                    subMessage="Returning to setup..."
                    onComplete={() => { setShowSuccess(false); setFormStep('method-select'); }}
                />
            </>
        );
    }

    if (formStep === 'method-select') {
        return (
            <>
                <SetupHub />
                <div id="recaptcha-container"></div>
            </>
        );
    }

    // Default: details-form (and otp-verify falls through here too)
    return (
        <>
            <PersonalDetailsStep />
            <div id="recaptcha-container"></div>
            <SuccessAnimation
                isVisible={showSuccess}
                message="Personal Details Saved!"
                subMessage="Returning to setup..."
                onComplete={() => { setShowSuccess(false); setFormStep('method-select'); }}
            />
        </>
    );
};

// ─── Main Component (provides context) ───────────────────────────────
const ArtistSignupView: React.FC = () => (
    <ArtistSignupProvider>
        <ArtistSignupRouter />
    </ArtistSignupProvider>
);

export default ArtistSignupView;
