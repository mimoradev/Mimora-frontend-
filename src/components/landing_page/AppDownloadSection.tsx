import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginBottomSheet from "../common/LoginBottomSheet";

const AppDownloadSection: React.FC = () => {
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, userType } = useAuth();

    const handleNotifyClick = () => {
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

        // Desktop: navigate directly
        navigate('/auth');
    };

    return (
        <>
            <section className="w-full relative overflow-hidden">
                {/* Desktop View */}
                <div
                    className="hidden md:flex items-start w-full h-screen bg-cover bg-center bg-no-repeat relative"
                    style={{
                        backgroundImage: "url('/info/landing/join/Footer_image_web.webp')",
                    }}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="relative z-10 max-w-[1440px] w-full mx-auto px-10 md:px-16 pt-32">
                        <div className="max-w-[550px]">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-white text-[18px] font-semibold">
                                    Launching soon
                                </span>
                                <div className="flex gap-2">
                                    <img src="/info/common/android.svg" alt="Android" className="w-6 h-6" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                    <img src="/info/common/apple.svg" alt="iOS" className="w-6 h-6" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                </div>
                            </div>

                            <h2 className="text-white text-[44px] md:text-[52px] font-bold leading-[1.1] mb-6">
                                Crafting our
                                <br />
                                Mobile Experience
                            </h2>

                            <motion.button
                                onClick={handleNotifyClick}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E84A7F] text-white text-[15px] font-semibold rounded-full shadow-lg shadow-[#E84A7F]/30"
                                whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(232,74,127,0.4)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Mail className="w-5 h-5" />
                                Notify me
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile View */}
                <div
                    className="flex md:hidden items-start w-full h-screen bg-cover bg-center bg-no-repeat relative"
                    style={{
                        backgroundImage: "url('/info/landing/join/footer_image_mobile.webp')",
                    }}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="relative z-10 w-full px-6 pt-24">
                        <div className="max-w-[400px]">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="text-white text-[17px] font-semibold">
                                    Launching soon
                                </span>
                                <div className="flex gap-1.5">
                                    <img src="/info/common/android.svg" alt="Android" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                    <img src="/info/common/apple.svg" alt="iOS" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                </div>
                            </div>

                            <h2 className="text-white text-[36px] font-bold leading-[1.1] mb-5">
                                Crafting our Mobile Experience
                            </h2>

                            <motion.button
                                onClick={handleNotifyClick}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E84A7F] text-white text-[14px] font-semibold rounded-full shadow-lg shadow-[#E84A7F]/30"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Mail className="w-4 h-4" />
                                Notify me
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section>

            <LoginBottomSheet
                isOpen={showBottomSheet}
                onClose={() => setShowBottomSheet(false)}
            />
        </>
    );
};

export default AppDownloadSection;
