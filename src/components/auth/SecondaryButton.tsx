import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
    compact?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    children,
    icon,
    compact = false,
    className = '',
    ...props
}) => {
    const heightClass = compact ? 'h-10' : 'h-12';

    return (
        <button
            className={`
        auth-secondary-btn
        w-full ${heightClass}
        flex items-center justify-center gap-3
        text-sm font-medium text-[#1E1E1E]
        bg-white
        border border-[#E0E0E0] rounded-xl
        cursor-pointer
        hover:bg-gray-50 transition-colors
        ${className}
      `}
            {...props}
        >
            {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
            {children}
        </button>
    );
};


// Icons as separate components
export const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 5L10 10L17 5M3 15V5H17V15H3Z"
            stroke="#1E1E1E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
            x="5"
            y="2"
            width="10"
            height="16"
            rx="2"
            stroke="#1E1E1E"
            strokeWidth="1.5"
        />
        <circle cx="10" cy="15" r="1" fill="#1E1E1E" />
    </svg>
);

export const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.77h5.4a4.64 4.64 0 01-2 3.04v2.5h3.24c1.9-1.74 3-4.3 3-7.31z" fill="#4285F4" />
        <path d="M10 20c2.7 0 4.97-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.95-3.4.95-2.62 0-4.84-1.77-5.64-4.14H1.02v2.58A9.99 9.99 0 0010 20z" fill="#34A853" />
        <path d="M4.36 11.88a5.96 5.96 0 010-3.76V5.54H1.02a9.99 9.99 0 000 8.92l3.34-2.58z" fill="#FBBC05" />
        <path d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.99 9.99 0 0010 0 9.99 9.99 0 001.02 5.54l3.34 2.58C5.16 5.75 7.38 3.98 10 3.98z" fill="#EA4335" />
    </svg>
);

export default SecondaryButton;
