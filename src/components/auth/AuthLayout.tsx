import React from 'react';
import AuthImagePanel from './AuthImagePanel';
import AuthFormPanel from './AuthFormPanel';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div
            className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen lg:max-h-screen overflow-hidden page-transition-in"
            style={{
                maxWidth: '1440px',
                margin: '0 auto',
                backgroundColor: '#FFFFFF',
            }}
        >
            {/* Left Panel - Image Slideshow */}
            <AuthImagePanel />

            {/* Right Panel - Form */}
            <AuthFormPanel>
                {children}
            </AuthFormPanel>
        </div>
    );
};

export default AuthLayout;
