import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Handle navigation to auth page with smooth transition
    const handleLoginClick = () => {
        // Add exit animation class to the page
        document.body.classList.add('page-transition-out');

        // Navigate after animation completes
        setTimeout(() => {
            navigate('/auth');
            document.body.classList.remove('page-transition-out');
        }, 400);
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
        // Close mobile menu if open
        if (isOpen) setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white" style={{ height: '64px' }}>
            <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6 md:px-10">
                {/* Logo */}
                <a href="/" className="flex items-center">
                    <img
                        src="/info/common/logo.png"
                        alt="Mimora"
                        style={{ height: '28px', width: 'auto' }}
                        className="object-contain"
                    />
                </a>

                {/* Right side: Nav Links + Login + Hamburger */}
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
                        <a
                            href="#contact"
                            onClick={(e) => handleSmoothScroll(e, 'contact')}
                            className="text-[14px] font-medium text-[#2B2B2B] hover:text-[#1E1E1E] transition-colors"
                        >
                            Contact us
                        </a>
                    </div>

                    {/* Login Button - Always Visible */}
                    <button
                        onClick={handleLoginClick}
                        className="flex items-center justify-center bg-[#111111] text-white text-[13px] font-medium rounded-full transition-all duration-200 hover:scale-[1.02]"
                        style={{
                            height: '36px',
                            paddingLeft: '14px',
                            paddingRight: '14px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        Login
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-[#1E1E1E]"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-[64px] left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <a
                        href="#services"
                        onClick={(e) => handleSmoothScroll(e, 'services')}
                        className="text-[16px] font-medium text-[#2B2B2B] hover:text-[#E84A7F] py-2"
                    >
                        Services
                    </a>
                    <a
                        href="#contact"
                        onClick={(e) => handleSmoothScroll(e, 'contact')}
                        className="text-[16px] font-medium text-[#2B2B2B] hover:text-[#E84A7F] py-2"
                    >
                        Contact us
                    </a>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

