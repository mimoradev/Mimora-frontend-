import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function HeroSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax effect: Subtle movement to prevent gaps
    const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

    // Smooth scroll to services section
    const scrollToServices = () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section className="w-full bg-white overflow-x-clip">
            {/* Hero Content Container */}
            <div className="max-w-[1440px] mx-auto">
                {/* Headline */}
                <div className="pt-10 text-center relative z-0 px-4 md:px-0">
                    <h1 className="leading-tight">
                        <span className="block font-semibold text-[#1E1E1E] text-3xl md:text-5xl">
                            Pick Your
                        </span>
                        <span className="block font-bold italic text-[#E84A7F] text-3xl md:text-5xl">
                            Favourite Artist
                        </span>
                    </h1>
                </div>

                {/* Image Collage Section - Full width edge to edge */}
                <div ref={containerRef} className="relative w-full z-10 mt-8 md:mt-0">
                    {/* Desktop Fan Animation */}
                    <motion.div
                        className="hidden md:block w-full relative h-[450px]"
                        style={{ y }}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            y: [0, -10, 0] // Breathing animation reapplied
                        }}
                        transition={{
                            opacity: { duration: 0.5 },
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2.0 // Wait for spread to finish before breathing starts
                            }
                        }}
                        whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* Define the slice styles to reuse the image */}
                        {/* 5 Slices. Assuming 20% width each roughly.
                            We use background-image to keep pixel perfection.
                            We animate 'x' from a centered offset to 0.
                        */}

                        {/* Card 1: Far Left (0-20%) -> Starts at +40% (Center) */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-size-[100%_auto] z-10"
                            style={{
                                backgroundImage: 'url("/info/landing/hero/Group 625888.png")',
                                clipPath: 'inset(0 80% 0 0)',
                            }}
                            initial={{ x: '40%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }} // Starts last
                        />

                        {/* Card 2: Mid Left (20-40%) -> Starts at +20% (Center) */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-size-[100%_auto] z-20"
                            style={{
                                backgroundImage: 'url("/info/landing/hero/Group 625888.png")',
                                clipPath: 'inset(0 60% 0 20%)',
                            }}
                            initial={{ x: '20%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }} // Starts second
                        />

                        {/* Card 3: Center (40-60%) -> Starts at 0 (Center) */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-size-[100%_auto] z-30"
                            style={{
                                backgroundImage: 'url("/info/landing/hero/Group 625888.png")',
                                clipPath: 'inset(0 40% 0 40%)',
                            }}
                            // Breathing animation on the center card (or all? User asked for breathing. Let's apply breathing to the CONTAINER to move them all together)
                            // But here we just handle the spread.
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />

                        {/* Card 4: Mid Right (60-80%) -> Starts at -20% (Center) */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-size-[100%_auto] z-20"
                            style={{
                                backgroundImage: 'url("/info/landing/hero/Group 625888.png")',
                                clipPath: 'inset(0 20% 0 60%)',
                            }}
                            initial={{ x: '-20%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }} // Starts second
                        />

                        {/* Card 5: Far Right (80-100%) -> Starts at -40% (Center) */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-size-[100%_auto] z-10"
                            style={{
                                backgroundImage: 'url("/info/landing/hero/Group 625888.png")',
                                clipPath: 'inset(0 0 0 80%)',
                            }}
                            initial={{ x: '-40%' }}
                            animate={{ x: '0%' }}
                            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }} // Starts last
                        />

                        {/* Ghost image for sizing - invisible but takes up space to set container height correctly */}
                        <img
                            src="/info/landing/hero/Group 625888.png"
                            alt="Beauty and makeup artists collage"
                            className="w-full h-auto opacity-0 pointer-events-none"
                        />
                    </motion.div>

                    {/* Mobile Static View - Centered "Zoomed" Image */}
                    <motion.div
                        className="md:hidden w-full h-[350px] relative overflow-hidden"
                        animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.01, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div
                            className="w-full h-full bg-no-repeat bg-center"
                            style={{
                                backgroundImage: 'url("/info/landing/hero/Group 625888.png")',
                                backgroundSize: '240% auto' // Zoom in significantly to show middle sections prominently
                            }}
                        />
                        {/* Bottom gradient overlay - white fade */}
                        <div className="absolute bottom-0 left-0 right-0 pointer-events-none h-[80px] bg-linear-to-t from-white to-transparent" />
                    </motion.div>

                    {/* Bottom gradient overlay - white fade */}
                    <div className="absolute bottom-0 left-0 right-0 pointer-events-none h-[150px] bg-linear-to-t from-white via-white/50 to-transparent" />
                </div>
            </div>

            {/* How it works section */}
            <div className="w-full flex flex-col gap-6 items-center justify-center -mt-4 relative z-10">
                {/* Pink bounce button - sits above the grey strip */}
                <button
                    onClick={scrollToServices}
                    className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#E84A7F] shadow-lg shadow-[#E84A7F]/25 animate-gentle-bounce cursor-pointer hover:scale-105 transition-transform"
                >
                    <ChevronDown className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>

                {/* Grey strip with only "How it works" text */}
                <div className="w-full bg-[#F7F7F7]">
                    <div className="flex items-center justify-center gap-1 py-6 cursor-pointer hover:opacity-80 transition-opacity text-sm text-[#666666] font-medium">
                        <span>How it works</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
