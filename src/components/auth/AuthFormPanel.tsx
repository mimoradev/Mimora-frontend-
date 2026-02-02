import React from 'react';

interface AuthFormPanelProps {
    children: React.ReactNode;
    className?: string;
}

const AuthFormPanel: React.FC<AuthFormPanelProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-6 py-6 lg:px-12 ${className}`}
            style={{ backgroundColor: '#FFFFFF' }}
        >
            <div className="w-full max-w-[420px]">
                {/* MIMORA Branding */}
                <div className="mb-6">
                    <span
                        className="text-sm font-medium tracking-wider"
                        style={{ color: '#E84A7F' }}
                    >
                        MIMORA
                    </span>
                </div>

                {/* Form content */}
                <div className="auth-view-enter">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthFormPanel;


