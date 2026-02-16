import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import LoginBottomSheet from './LoginBottomSheet';

function Navbar() {
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, userType } = useAuth();

    // Handle navigation to auth page with smooth transition
    const handleLoginClick = () => {
        // If already logged in, redirect to appropriate home page
        if (isAuthenticated) {
            const destination = userType === 'artist' ? '/artist/home' : '/home';
            navigate(destination);
            return;
        }

        // Check if mobile view (less than 768px)
        if (window.innerWidth < 768) {
            setShowBottomSheet(true);
            return;
        }

        // Desktop: navigate directly — AnimatePresence handles the transition
        navigate('/auth');
    };

    // Smooth scroll handler for navigation links
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <>
            <nav className="sticky top-0 left-0 right-0 z-50 bg-white" style={{ height: '64px' }}>
                <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-4 md:px-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/info/common/new-logo.png"
                            alt="Mimora"
                            style={{ height: '38px', width: 'auto' }}
                            className="object-contain"
                            onError={(e) => {
                                // Fallback to old logo if new one isn't present, though we should have copied assets
                                e.currentTarget.src = "/info/common/logo.png";
                                e.currentTarget.style.height = "28px";
                            }}
                        />
                    </Link>

                    {/* Right side: Nav Links + Join */}
                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <a
                                href="#services"
                                onClick={(e) => handleSmoothScroll(e, 'services')}
                                className="text-[14px] font-medium text-[#2B2B2B] hover:text-[#1E1E1E] transition-colors"
                            >
                                Services
                            </a>
                            <Link
                                to="/contact"
                                className="text-[14px] font-medium text-[#2B2B2B] hover:text-[#1E1E1E] transition-colors"
                            >
                                Contact us
                            </Link>
                        </div>

                        {/* Login Button - Always Visible */}
                        <motion.button
                            onClick={handleLoginClick}
                            className="flex items-center justify-center bg-[#E84A7F] text-white text-[13px] font-semibold rounded-full cursor-pointer"
                            style={{
                                height: '36px',
                                paddingLeft: '18px',
                                paddingRight: '18px',
                                boxShadow: '0 2px 8px rgba(232,74,127,0.25)'
                            }}
                            whileHover={{ scale: 1.05, boxShadow: '0 4px 16px rgba(232,74,127,0.35)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isAuthenticated ? 'Dashboard' : 'Login'}
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Mobile Login Bottom Sheet */}
            <LoginBottomSheet
                isOpen={showBottomSheet}
                onClose={() => setShowBottomSheet(false)}
            />
        </>
    );
}

export default Navbar;

