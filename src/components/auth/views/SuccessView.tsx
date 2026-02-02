import React from 'react';
import PrimaryButton from '../PrimaryButton';

interface SuccessViewProps {
    onContinue: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ onContinue }) => {
    return (
        <div className="auth-view-enter text-center py-8">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" stroke="#22C55E" strokeWidth="3" />
                    <path
                        d="M12 20L17 25L28 14"
                        stroke="#22C55E"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Heading */}
            <h1 className="text-[28px] font-semibold text-[#1E1E1E] leading-tight mb-2">
                Account Created!
            </h1>
            <p className="text-sm text-[#6B6B6B] mb-8">
                Your account has been successfully created. Welcome to Mimora!
            </p>

            {/* Continue Button */}
            <PrimaryButton onClick={onContinue}>
                Continue to App
            </PrimaryButton>
        </div>
    );
};

export default SuccessView;
