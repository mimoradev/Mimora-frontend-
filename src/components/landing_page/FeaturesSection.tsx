import React from "react";

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
        image: "/info/landing/service/Book Nearby Artists, Anytime.png",
    },
    {
        title: "Build Your Beauty Business",
        description: [
            "Mimora empowers beauty professionals to grow their business digitally.",
            "Manage bookings, set your own prices, connect with new clients, and get paid securely — all in one place.",
        ],
        image: "/info/landing/service/Build Your Beauty Business.png",
    },
    {
        title: "Plan Your Big Day, Your Way",
        description: [
            "Choose top-rated artists, explore service packages, check availability, and book in advance for weddings, parties, and special events.",
        ],
        image: "/info/landing/service/Plan Your Big Day, Your Way.png",
    },
    {
        title: "Learn From the Best",
        description: [
            "Upgrade your beauty skills by joining online or offline workshops hosted by experienced artists and industry professionals.",
        ],
        image: "/info/landing/service/Learn From the Best.png",
    },
];

const FeaturesSection: React.FC = () => {
    return (
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

            {/* Feature Blocks (Strict Flexbox Alignment) */}
            <div className="max-w-[1240px] w-full px-6 md:px-12 flex flex-col gap-16 md:gap-24">
                {features.map((feature, index) => {
                    const isEven = index % 2 === 0; // Row 1 (0): Img Left. Row 2 (1): Text Left.

                    return (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 w-full ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Image Side - Strictly 50% width on Desktop */}
                            <div className="w-full md:w-1/2 flex justify-center md:items-center">
                                {/* 
                   For even rows (Img Left), we justify start or center?
                   User wants alignment. If Row 2 Text starts at X, Row 1 Image should probably end near X?
                   Or just centered in its half? Usually centered in the half is safest for "zig zag".
                   Let's keep centered in half for now, but ensure container is exactly 50%.
                */}
                                <div className="relative overflow-hidden rounded-[24px] w-full max-w-[380px] md:max-w-[420px] transition-transform duration-400 ease-out hover:scale-[1.015]">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-auto object-cover block"
                                    />
                                </div>
                            </div>

                            {/* Text Side - Strictly 50% width on Desktop */}
                            <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
                                {/* 
                      Constraint max-width to ensure it doesn't stretch too wide, 
                      but align it to the left of its container always so it "starts" at the middle line.
                   */}
                                <div className="max-w-[480px]">
                                    <h3 className="text-[26px] md:text-[28px] font-bold text-[#1E1E1E] mb-4 flex items-center group cursor-pointer tracking-tight">
                                        {feature.title}
                                        <span className="ml-2.5 transition-transform duration-250 ease-in-out group-hover:translate-x-[4px]">
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
    );
};

export default FeaturesSection;
