import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginBottomSheet from "../common/LoginBottomSheet";

interface Feature {
    title: string;
    description: string[];
    image: string;
}

const features: Feature[] = [
    {
        title: "Book Nearby Artists, Anytime",
        description: [
            "Discover and book top-rated beauty professionals in your area.",
            "Real-time availability and instant confirmation.",
        ],
        image: "/info/landing/service/Book Nearby Artists, Anytime.webp",
    },
    {
        title: "Build Your Beauty Business",
        description: [
            "Mimora empowers beauty professionals to grow their business digitally.",
            "Manage bookings, set your own prices, connect with new clients, and get paid securely — all in one place.",
        ],
        image: "/info/landing/service/Build Your Beauty Business.webp",
    },
    {
        title: "Plan Your Big Day, Your Way",
        description: [
            "Choose top-rated artists, explore service packages, check availability, and book in advance for weddings, parties, and special events.",
        ],
        image: "/info/landing/service/Plan Your Big Day, Your Way.webp",
    },
    {
        title: "Learn From the Best",
        description: [
            "Upgrade your beauty skills by joining online or offline workshops hosted by experienced artists and industry professionals.",
        ],
        image: "/info/landing/service/Learn From the Best.webp",
    },
];

const FeaturesSection: React.FC = () => {
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, userType } = useAuth();

    const handleFeatureClick = () => {
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
            <section id="services" className="w-full bg-[#FFFFFF] py-[80px] flex flex-col items-center">
                {/* Header */}
                <div className="max-w-[1240px] w-full px-6 md:px-12 flex flex-col items-center mb-20 text-center">
                    <h2 className="text-[32px] md:text-[36px] font-semibold text-[#1E1E1E] mb-4 leading-tight">
                        Beauty Services Made Simple
                    </h2>
                    <p className="text-[#6B6B6B] text-[15px] max-w-[550px] leading-relaxed">
                        Mimora helps you discover, compare, and book professional beauty services with confidence — no calls, no confusion.
                    </p>
                </div>

                {/* Feature Blocks - Fixed Width Containers */}
                <div className="max-w-[1240px] w-full px-6 md:px-12 flex flex-col gap-16 md:gap-28">
                    {features.map((feature, index) => {
                        const isEven = index % 2 === 0; // Row 1 (0): Img Left. Row 2 (1): Text Left.

                        return (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 w-full ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Image Container - Fixed Width */}
                                <div className="w-full md:w-auto flex justify-center md:justify-end">
                                    <div className="relative overflow-hidden rounded-[24px] w-full max-w-[380px] md:w-[420px] transition-transform duration-400 ease-out hover:scale-[1.015]">
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-auto object-cover block"
                                        />
                                    </div>
                                </div>

                                {/* Text Container - Fixed Width */}
                                <div className="w-full md:w-auto flex flex-col items-start justify-center">
                                    <div className="w-full md:w-[450px]">
                                        <h3 className="text-[26px] md:text-[28px] font-bold text-[#1E1E1E] mb-4 tracking-tight">
                                            {feature.title}{" "}
                                            <span
                                                onClick={handleFeatureClick}
                                                style={{ fontWeight: 900 }}
                                                className="font-extrabold cursor-pointer hover:text-[#E84A7F] transition-colors duration-200"
                                            >
                                                →
                                            </span>
                                        </h3>
                                        <div className="space-y-3">
                                            {feature.description.map((desc, i) => (
                                                <div key={i} className="text-[#6B6B6B] text-[15px] md:text-[16px] leading-relaxed flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#6B6B6B] shrink-0" />
                                                    <span>{desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <LoginBottomSheet
                isOpen={showBottomSheet}
                onClose={() => setShowBottomSheet(false)}
            />
        </>
    );
};

export default FeaturesSection;
