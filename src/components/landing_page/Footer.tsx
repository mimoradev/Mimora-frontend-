import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-[#FAFAFA] text-[#1E1E1E] py-8 border-t border-gray-100">
            <div className="max-w-[1440px] w-full mx-auto px-6 md:px-10">

                {/* Desktop Layout */}
                <div className="hidden md:flex justify-between items-center text-[13px] font-medium text-[#6B6B6B]">
                    {/* Left: Copyright & Links */}
                    <div className="flex items-center gap-6">
                        <span>@2025Mimora.All rights reserved.</span>
                        <span className="w-0.5 h-0.5 bg-[#6B6B6B] rounded-full"></span>
                        <a href="#" className="hover:text-black transition-colors">Privacy</a>
                        <span className="w-0.5 h-0.5 bg-[#6B6B6B] rounded-full"></span>
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                        <span className="w-0.5 h-0.5 bg-[#6B6B6B] rounded-full"></span>
                        <a href="#" className="hover:text-black transition-colors">Contact us</a>
                    </div>

                    {/* Right: Settings & Socials */}
                    <div className="flex items-center gap-6">
                        {/* Currency/Lang (Based on desktop crop showing INR) */}
                        <div className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                            <span className="w-4 h-4 flex items-center justify-center border border-current rounded-full text-[10px] font-serif">₹</span>
                            <span>INR</span>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            {/* X (Twitter) */}
                            <a href="#" className="hover:text-black transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="#" className="hover:text-black transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-3.36-4-3.11-4 0V19h-3v-9h3v1.27a5.37 5.37 0 015 0v-1.27h.01z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="hover:text-black transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="flex md:hidden flex-col gap-6 text-[14px] text-[#333]">

                    {/* Copyright */}
                    <div className="text-[13px] text-[#333]">
                        @2025Mimora.All rights reserved.
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-3">
                        <a href="#" className="hover:opacity-70">Privacy</a>
                        <a href="#" className="hover:opacity-70">Terms</a>
                        <a href="#" className="hover:opacity-70">Contact us</a>
                    </div>

                    {/* Bottom Row: Lang/Curr & Socials */}
                    <div className="flex justify-between items-center mt-4 pt-4">
                        <div className="flex gap-4">
                            {/* Lang */}
                            <div className="flex items-center gap-1.5 cursor-pointer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                                <span className="font-medium">English (IN)</span>
                            </div>
                            {/* Currency */}
                            <div className="flex items-center gap-1.5 cursor-pointer">
                                <span className="w-4 h-4 flex items-center justify-center border border-current rounded-full text-[10px] font-serif">₹</span>
                                <span className="font-medium">INR</span>
                            </div>
                        </div>

                        {/* Social Icons (Mobile) */}
                        <div className="flex items-center gap-4 text-[#333]">
                            <a href="#" className="">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-3.36-4-3.11-4 0V19h-3v-9h3v1.27a5.37 5.37 0 015 0v-1.27h.01z" />
                                </svg>
                            </a>
                            <a href="#" className="">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
