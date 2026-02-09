import React, { useState } from 'react';
import { Heart, Bell, Menu, X } from 'lucide-react';

const CustomerHomeNavbar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'instant' | 'flexi' | 'workshops'>('instant');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const tabs = [
        { id: 'instant' as const, label: 'Instant Up', icon: '👩‍🎨' },
        { id: 'flexi' as const, label: 'Flexi Up', icon: '⏰' },
        { id: 'workshops' as const, label: 'Workshops', icon: '🎓', comingSoon: true },
    ];

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-100" style={{ height: '64px' }}>
            <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-4 md:px-10">
                {/* Logo */}
                <a href="/home" className="flex items-center shrink-0">
                    <img
                        src="/info/common/logo.png"
                        alt="Mimora"
                        style={{ height: '28px', width: 'auto' }}
                        className="object-contain"
                    />
                </a>

                {/* Center Navigation Tabs - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium
                                transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-gray-100 text-[#1E1E1E]'
                                    : 'text-[#6B6B6B] hover:text-[#1E1E1E] hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span>{tab.label}</span>
                            {tab.comingSoon && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#E84A7F] text-white text-[8px] font-bold rounded-sm uppercase tracking-wide">
                                    Coming Soon
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-3">
                    {/* Heart Icon - Desktop */}
                    <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <Heart className="w-5 h-5 text-[#6B6B6B]" />
                    </button>

                    {/* Bell Icon - Desktop */}
                    <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative">
                        <Bell className="w-5 h-5 text-[#6B6B6B]" />
                        {/* Notification Badge */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#E84A7F] rounded-full"></span>
                    </button>

                    {/* Hamburger Menu */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-[#1E1E1E]" />
                        ) : (
                            <Menu className="w-5 h-5 text-[#1E1E1E]" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg animate-fade-in">
                    <div className="px-4 py-4 space-y-2">
                        {/* Mobile Navigation Tabs */}
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`
                                    relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium
                                    transition-all duration-200
                                    ${activeTab === tab.id
                                        ? 'bg-gray-100 text-[#1E1E1E]'
                                        : 'text-[#6B6B6B] hover:bg-gray-50'
                                    }
                                `}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                <span>{tab.label}</span>
                                {tab.comingSoon && (
                                    <span className="ml-auto px-2 py-0.5 bg-[#E84A7F] text-white text-[10px] font-bold rounded-sm uppercase">
                                        Coming Soon
                                    </span>
                                )}
                            </button>
                        ))}

                        {/* Divider */}
                        <div className="h-px bg-gray-100 my-2"></div>

                        {/* Mobile Action Buttons */}
                        <div className="flex items-center gap-4 px-4 py-2">
                            <button className="flex items-center gap-2 text-[14px] text-[#6B6B6B]">
                                <Heart className="w-5 h-5" />
                                <span>Wishlist</span>
                            </button>
                            <button className="flex items-center gap-2 text-[14px] text-[#6B6B6B]">
                                <Bell className="w-5 h-5" />
                                <span>Notifications</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default CustomerHomeNavbar;
