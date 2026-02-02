import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
    value: string[];
    onChange: (otp: string[]) => void;
    length?: number;
    disabled?: boolean;
    error?: string;
    compact?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
    value,
    onChange,
    length = 6,
    disabled = false,
    error,
    compact = false,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (index: number, inputValue: string) => {
        // Only accept single digit
        const digit = inputValue.replace(/\D/g, '').slice(-1);

        const newOtp = [...value];
        newOtp[index] = digit;
        onChange(newOtp);

        // Auto-focus next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            // Focus previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            const newOtp = [...value];
            pastedData.split('').forEach((digit, i) => {
                if (i < length) newOtp[i] = digit;
            });
            onChange(newOtp);

            // Focus the next empty input or last input
            const nextEmptyIndex = newOtp.findIndex(v => !v);
            const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const hasError = !!error;
    const sizeClass = compact ? 'w-10 h-10' : 'w-12 h-12';
    const textClass = compact ? 'text-base' : 'text-lg';

    return (
        <div className="w-full">
            <div className="flex gap-2 justify-start">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[index] || ''}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={`
                            auth-otp-input
                            ${sizeClass}
                            text-center ${textClass} font-medium text-[#1E1E1E]
                            bg-white
                            border rounded-xl
                            focus:outline-none
                            disabled:bg-gray-50 disabled:cursor-default
                            transition-colors
                            ${hasError
                                ? 'border-red-500 text-red-500 focus:border-red-500'
                                : 'border-[#E0E0E0] focus:border-[#1E1E1E]'
                            }
                        `}
                    />
                ))}
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default OTPInput;

