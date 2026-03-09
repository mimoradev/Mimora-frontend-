import React, { useState, useEffect, useRef } from 'react';

interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: (otp: string) => Promise<boolean>;
    onResend?: () => Promise<void>;
    length?: number;
    isVerifying?: boolean;
    isSending?: boolean;
    error?: string;
    successMessage?: string;
}

const OTPInputField: React.FC<OTPInputProps> = ({
    value,
    onChange,
    onComplete,
    onResend,
    length = 6,
    isVerifying = false,
    isSending = false,
    error,
    successMessage
}) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [localError, setLocalError] = useState<string>('');
    const [localSuccess, setLocalSuccess] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Clear local messages when external props change
    useEffect(() => {
        if (error) setLocalError(error);
        if (successMessage) setLocalSuccess(successMessage);
    }, [error, successMessage]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    // Auto-verify when all digits are entered
    useEffect(() => {
        if (value.length === length && onComplete && !isVerifying) {
            setLocalError('');
            setLocalSuccess('');
            onComplete(value);
        }
    }, [value, length, onComplete, isVerifying]);

    const handleChange = (index: number, digit: string) => {
        // Only allow numbers
        if (digit && !/^\d$/.test(digit)) return;

        // Clear error when typing
        setLocalError('');

        const newOtp = value.split('');
        newOtp[index] = digit;
        onChange(newOtp.join(''));

        // Auto-focus next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace - move to previous input
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        onChange(pastedData);
        setLocalError('');
        // Focus the next empty input or the last one
        const focusIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleResend = async () => {
        if (canResend && onResend && !isResending) {
            setIsResending(true);
            setLocalError('');
            setLocalSuccess('');
            try {
                await onResend();
                setResendTimer(30);
                setCanResend(false);
                onChange(''); // Clear OTP
                setLocalSuccess('OTP sent successfully!');
                // Clear success message after 3 seconds
                setTimeout(() => setLocalSuccess(''), 3000);
            } catch {
                setLocalError('Failed to resend OTP. Please try again.');
            } finally {
                setIsResending(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const displayError = localError || error;
    const displaySuccess = localSuccess || successMessage;
    const hasError = !!displayError;
    const hasSuccess = !!displaySuccess;

    return (
        <div className="space-y-3">
            {/* OTP Label */}
            <p className="text-sm text-gray-600">Enter OTP (One Time Password)</p>

            {/* OTP Input Boxes */}
            <div className="flex gap-3 justify-start">
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[i] || ''}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onFocus={() => setFocusedIndex(i)}
                        onBlur={() => setFocusedIndex(null)}
                        onPaste={i === 0 ? handlePaste : undefined}
                        disabled={isVerifying || isSending}
                        className={`w-12 h-14 text-center text-xl font-semibold rounded-xl transition-all duration-200 outline-none ${isVerifying || isSending
                            ? 'bg-gray-100 border-2 border-gray-200 text-gray-400'
                            : hasError
                                ? 'border-2 border-red-400 bg-red-50'
                                : hasSuccess
                                    ? 'border-2 border-emerald-400 bg-emerald-50'
                                    : focusedIndex === i
                                        ? 'border-2 border-gray-800 shadow-sm'
                                        : value[i]
                                            ? 'border-2 border-gray-300 bg-white'
                                            : 'border-2 border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    />
                ))}
            </div>

            {/* Status Messages */}
            {displayError && (
                <div className="flex items-center gap-2 text-sm text-red-600 animate-in fade-in duration-200">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{displayError}</span>
                </div>
            )}
            {displaySuccess && !displayError && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 animate-in fade-in duration-200">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{displaySuccess}</span>
                </div>
            )}

            {/* Timer and Resend */}
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {isVerifying ? (
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : isSending ? (
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending OTP...
                        </span>
                    ) : (
                        formatTime(resendTimer)
                    )}
                </span>
                <button
                    onClick={handleResend}
                    disabled={!canResend || isVerifying || isResending || isSending}
                    className={`text-sm font-medium transition-colors ${canResend && !isVerifying && !isResending && !isSending
                        ? 'text-gray-800 hover:text-[#E91E63] cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
            </div>
        </div>
    );
};

export default OTPInputField;
