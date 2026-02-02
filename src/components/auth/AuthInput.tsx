import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    rightElement?: React.ReactNode;
    compact?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
    label,
    error,
    rightElement,
    compact = false,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label
                    className="block text-xs text-gray-500 mb-1"
                    htmlFor={props.id}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    className={`
            auth-input
            w-full ${compact ? 'h-10' : 'h-12'} px-4
            text-sm text-[#1E1E1E]
            bg-white
            border rounded-xl
            placeholder:text-gray-400
            ${error ? 'border-red-400' : 'border-[#E0E0E0]'}
            ${rightElement ? 'pr-20' : ''}
            ${className}
          `}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default AuthInput;

