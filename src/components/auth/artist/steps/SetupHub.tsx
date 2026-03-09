import React from 'react';
import { useArtistSignup } from '../ArtistSignupContext';
import { BackArrowIcon, LockIcon, PhoneIcon, EmailIcon, GoogleIcon, PersonalDetailsIcon, BookingModesIcon, PortfolioIcon, BankDetailsIcon } from '../icons';

// ─── Signup Method Button ────────────────────────────────────────────
interface SignupMethodButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const SignupMethodButton: React.FC<SignupMethodButtonProps> = ({ icon, label, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full 
                   hover:border-[#E91E63] hover:bg-pink-50 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 bg-white"
    >
        {icon}
        <span>{label}</span>
    </button>
);

// ─── Step Card ───────────────────────────────────────────────────────
interface StepCardProps {
    stepNumber: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    isActive: boolean;
    isCompleted: boolean;
    onContinue?: () => void;
}

const StepCard: React.FC<StepCardProps> = ({
    stepNumber,
    title,
    description,
    icon,
    isActive,
    isCompleted,
    onContinue,
}) => (
    <div
        className={`rounded-xl transition-all duration-300 ${isCompleted
            ? 'bg-green-50/50 border border-green-200 p-4'
            : isActive
                ? 'bg-white border-2 border-gray-300 shadow-sm p-4'
                : 'bg-white/50 border border-gray-100 p-3'
            }`}
    >
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                            ? 'bg-[#1E1E1E] text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                >
                    {isCompleted ? '✓' : isActive ? stepNumber : <LockIcon />}
                </div>
                <div>
                    <p className={`text-xs ${isCompleted ? 'text-green-600' : isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                        Step {stepNumber}
                    </p>
                    <h3 className={`text-sm font-semibold ${isCompleted ? 'text-green-700' : isActive ? 'text-[#1E1E1E]' : 'text-gray-500'}`}>
                        {title}
                    </h3>
                    {!isActive && !isCompleted && (
                        <p className="text-xs text-gray-400">{description}</p>
                    )}
                    {isCompleted && (
                        <p className="text-xs text-green-600">Completed</p>
                    )}
                </div>
            </div>
            <div className={`shrink-0 ${!isActive && !isCompleted && 'opacity-40'}`}>{icon}</div>
        </div>
        {isActive && onContinue && (
            <div className="mt-3 ml-9">
                <button
                    onClick={onContinue}
                    className="px-5 py-2 text-sm font-medium text-white bg-[#1E1E1E] rounded-lg hover:bg-[#333] transition-colors"
                >
                    Continue
                </button>
            </div>
        )}
    </div>
);

// ─── Setup Hub (Method Selection) ────────────────────────────────────
const SetupHub: React.FC = () => {
    const {
        navigate, isLoading,
        setupSteps, activeStep,
        handlePhoneSignup, handleEmailSignup, handleGoogleSignup,
        handleStepContinue,
    } = useArtistSignup();

    return (
        <div className="h-screen bg-[#FAF9F8] relative overflow-hidden">
            <button
                onClick={() => navigate('/auth/artist/login')}
                className="absolute top-5 left-5 flex items-center gap-2 text-gray-600 hover:text-[#1E1E1E] transition-colors z-10"
            >
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50">
                    <BackArrowIcon />
                </div>
                <span className="text-sm font-medium">Back to Sign in</span>
            </button>

            <div className="h-full flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-xl">
                    <div className="flex justify-center mb-3">
                        <img
                            src="/info/signup/Gemini_Generated_Image_ul535hul535hul53 1.png"
                            alt="Artist"
                            className="w-24 h-auto"
                        />
                    </div>
                    <h1 className="text-lg font-semibold text-center text-[#1E1E1E] mb-4">
                        Set up your artist account in 4 steps
                    </h1>

                    <div className="space-y-2">
                        {/* Step 1: Personal Details */}
                        {setupSteps.step1 ? (
                            <StepCard
                                stepNumber={1}
                                title="Personal details"
                                description="Basic details about you"
                                icon={<PersonalDetailsIcon />}
                                isActive={false}
                                isCompleted={true}
                            />
                        ) : (
                            <div className="rounded-xl bg-white border-2 border-gray-300 shadow-sm p-4">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-[#1E1E1E] text-white">
                                            1
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Step 1</p>
                                            <h3 className="text-sm font-semibold text-[#1E1E1E]">Personal details</h3>
                                        </div>
                                    </div>
                                    <PersonalDetailsIcon />
                                </div>
                                <div className="flex flex-wrap gap-2 ml-9">
                                    <SignupMethodButton icon={<PhoneIcon />} label="Sign up with" onClick={handlePhoneSignup} disabled={isLoading} />
                                    <SignupMethodButton icon={<EmailIcon />} label="Sign up with" onClick={handleEmailSignup} disabled={isLoading} />
                                    <SignupMethodButton icon={<GoogleIcon />} label="Sign up with" onClick={handleGoogleSignup} disabled={isLoading} />
                                </div>
                            </div>
                        )}

                        {/* Steps 2-4 */}
                        <StepCard
                            stepNumber={2}
                            title="Booking Modes"
                            description="Pick your categories and specialization"
                            icon={<BookingModesIcon />}
                            isActive={activeStep === 2}
                            isCompleted={setupSteps.step2}
                            onContinue={activeStep === 2 ? () => handleStepContinue(2) : undefined}
                        />
                        <StepCard
                            stepNumber={3}
                            title="Portfolio"
                            description="Showcase your best work"
                            icon={<PortfolioIcon />}
                            isActive={activeStep === 3}
                            isCompleted={setupSteps.step3}
                            onContinue={activeStep === 3 ? () => handleStepContinue(3) : undefined}
                        />
                        <StepCard
                            stepNumber={4}
                            title="Bank details"
                            description="Set up your account details for payouts"
                            icon={<BankDetailsIcon />}
                            isActive={activeStep === 4}
                            isCompleted={setupSteps.step4}
                            onContinue={activeStep === 4 ? () => handleStepContinue(4) : undefined}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupHub;
