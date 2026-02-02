import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    compact?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    isLoading = false,
    compact = false,
    disabled,
    className = '',
    ...props
}) => {
    const isDisabled = disabled || isLoading;
    const heightClass = compact ? 'h-10' : 'h-12';

    return (
        <button
            className={`
        auth-primary-btn
        w-full ${heightClass}
        flex items-center justify-center gap-2
        text-sm font-medium text-white
        rounded-full
        transition-colors
        ${isDisabled
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#1E1E1E] hover:bg-[#2a2a2a] cursor-pointer'
                }
        ${className}
      `}
            disabled={isDisabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                children
            )}
        </button>
    );
};

export default PrimaryButton;

