import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessAnimationProps {
    isVisible: boolean;
    message?: string;
    subMessage?: string;
    onComplete?: () => void;
    autoHideDelay?: number;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
    isVisible,
    message = "Success!",
    subMessage = "Redirecting...",
    onComplete,
    autoHideDelay = 2500
}) => {
    useEffect(() => {
        if (isVisible && onComplete) {
            const timer = setTimeout(() => {
                onComplete();
            }, autoHideDelay);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete, autoHideDelay]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                >
                    {/* Background blur overlay */}
                    <div className="absolute inset-0 backdrop-blur-sm" />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        {/* Animated checkmark circle */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.1
                            }}
                            className="w-28 h-28 mx-auto mb-8 relative"
                        >
                            {/* Outer ring pulse */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 rounded-full bg-linear-to-r from-emerald-400 to-green-500"
                            />

                            {/* Main circle */}
                            <div className="absolute inset-2 rounded-full bg-linear-to-br from-emerald-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                                {/* Checkmark SVG */}
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Title text */}
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="text-2xl font-bold text-gray-900 mb-2"
                        >
                            {message}
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.65, duration: 0.4 }}
                            className="text-gray-500 text-sm"
                        >
                            {subMessage}
                        </motion.p>

                        {/* Loading dots */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center gap-1.5 mt-4"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -6, 0],
                                        opacity: [0.4, 1, 0.4]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut"
                                    }}
                                    className="w-2 h-2 rounded-full bg-emerald-500"
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Confetti-like particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: '50%',
                                    y: '50%',
                                    scale: 0,
                                    opacity: 0
                                }}
                                animate={{
                                    x: `${20 + Math.random() * 60}%`,
                                    y: `${20 + Math.random() * 60}%`,
                                    scale: [0, 1, 0.5],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: 0.2 + i * 0.05,
                                    ease: "easeOut"
                                }}
                                className={`absolute w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-pink-400' :
                                    i % 3 === 1 ? 'bg-emerald-400' : 'bg-amber-400'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SuccessAnimation;
