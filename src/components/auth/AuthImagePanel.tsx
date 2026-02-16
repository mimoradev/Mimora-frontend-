import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Images for the slideshow
const slideshowImages = [
    '/info/signup/login_image_web.webp',
    '/info/signup/signup_image1_web.webp',
    '/info/signup/signupimage_2.webp',
];

interface AuthImagePanelProps {
    className?: string;
}

const AuthImagePanel: React.FC<AuthImagePanelProps> = ({ className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Auto-advance slides
    const goToNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, []);

    // Setup auto-rotation
    useEffect(() => {
        intervalRef.current = setInterval(goToNext, 4500);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [goToNext]);

    // Parallax Stack Animation Variants
    const slideVariants = {
        // Incoming slide - starts from right, scaled down, with depth
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            scale: 0.85,
            rotateY: direction > 0 ? 15 : -15,
            opacity: 0,
            zIndex: 1,
            filter: 'brightness(0.7)',
        }),
        // Active slide - centered, full scale
        center: {
            x: 0,
            scale: 1,
            rotateY: 0,
            opacity: 1,
            zIndex: 2,
            filter: 'brightness(1)',
            transition: {
                x: { type: 'spring' as const, stiffness: 50, damping: 20 },
                scale: { type: 'spring' as const, stiffness: 80, damping: 25 },
                rotateY: { type: 'spring' as const, stiffness: 60, damping: 20 },
                opacity: { duration: 0.6, ease: 'easeOut' as const },
                filter: { duration: 0.8, ease: 'easeOut' as const },
            },
        },
        // Outgoing slide - moves to left, scales down with depth
        exit: (direction: number) => ({
            x: direction > 0 ? '-30%' : '30%',
            scale: 0.9,
            rotateY: direction > 0 ? -8 : 8,
            opacity: 0,
            zIndex: 0,
            filter: 'brightness(0.5)',
            transition: {
                x: { type: 'spring' as const, stiffness: 50, damping: 25 },
                scale: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const },
                rotateY: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const },
                opacity: { duration: 0.6, ease: 'easeIn' as const, delay: 0.1 },
                filter: { duration: 0.6, ease: 'easeIn' as const },
            },
        }),
    };

    return (
        <div
            className={`hidden lg:block w-1/2 h-full overflow-hidden relative ${className}`}
            style={{
                perspective: '1200px',
                perspectiveOrigin: 'center center',
            }}
        >
            {/* Background gradient for depth effect */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.08) 100%)',
                }}
            />

            {/* Animated Image Container */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full"
                    style={{
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <img
                        src={slideshowImages[currentIndex]}
                        alt="Mimora app showcase"
                        className="w-full h-full"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'left center',
                            borderRadius: '0',
                        }}
                        draggable={false}
                    />

                    {/* Subtle overlay for depth */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0.15 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 50%)',
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {slideshowImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                            // Reset interval on manual navigation
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                                intervalRef.current = setInterval(goToNext, 4500);
                            }
                        }}
                        className="relative w-2 h-2 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: index === currentIndex ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
                            transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)',
                            boxShadow: index === currentIndex ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Subtle vignette effect for premium look */}
            <div
                className="absolute inset-0 pointer-events-none z-5"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.1) 100%)',
                }}
            />
        </div>
    );
};

export default AuthImagePanel;
