import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

interface CarouselImage {
    id: number;
    color: string;
}

const HeroCarousel: React.FC = () => {
    const [offset, setOffset] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // 8 placeholder images with different colors
    const images: CarouselImage[] = [
        { id: 1, color: '#D4A574' }, // Warm brown
        { id: 2, color: '#8B7355' }, // Coffee brown
        { id: 3, color: '#C9A86C' }, // Gold
        { id: 4, color: '#A0826D' }, // Terracotta
        { id: 5, color: '#B8860B' }, // Dark goldenrod
        { id: 6, color: '#CD853F' }, // Peru
        { id: 7, color: '#DEB887' }, // Burlywood
        { id: 8, color: '#D2691E' }, // Chocolate
    ];

    // Duplicate images for seamless infinite scroll
    const duplicatedImages = [...images, ...images, ...images];

    const imageWidth = 280;
    const imageGap = 20;
    const totalWidth = images.length * (imageWidth + imageGap);

    // Infinite scroll animation
    useAnimationFrame((time) => {
        const speed = 0.03; // Adjust speed here
        const newOffset = (time * speed) % totalWidth;
        setOffset(newOffset);
    });

    // Calculate scale based on position from center
    const getImageScale = (index: number, currentOffset: number) => {
        const containerWidth = containerRef.current?.offsetWidth || 1200;
        const centerX = containerWidth / 2;

        // Position of this image
        const imagePosition = index * (imageWidth + imageGap) - currentOffset + imageWidth / 2;

        // Normalized distance from center (0 = center, 1 = edge)
        const distanceFromCenter = Math.abs(imagePosition - centerX) / (containerWidth / 2);

        // Scale: 1.15 at center, 0.85 at edges
        const scale = Math.max(0.75, 1.15 - distanceFromCenter * 0.4);

        // Opacity: 1 at center, 0.6 at edges
        const opacity = Math.max(0.5, 1 - distanceFromCenter * 0.5);

        // Z-index based on proximity to center
        const zIndex = Math.round((1 - distanceFromCenter) * 10);

        return { scale, opacity, zIndex };
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: '320px' }}
        >
            <motion.div
                className="absolute flex items-center"
                style={{
                    height: '100%',
                    gap: `${imageGap}px`,
                    x: -offset,
                }}
            >
                {duplicatedImages.map((image, index) => {
                    const { scale, opacity, zIndex } = getImageScale(index, offset);

                    return (
                        <motion.div
                            key={`${image.id}-${index}`}
                            className="shrink-0 rounded-2xl overflow-hidden"
                            style={{
                                width: `${imageWidth}px`,
                                height: '240px',
                                backgroundColor: image.color,
                                scale,
                                opacity,
                                zIndex,
                                boxShadow: scale > 1
                                    ? '0 20px 40px rgba(0, 0, 0, 0.15)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            {/* Placeholder content - replace with actual images later */}
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/50 text-sm font-medium">
                                    Image {image.id}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Gradient overlays for smooth edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#FFE9F0] to-transparent pointer-events-none z-20"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#FFE9F0] to-transparent pointer-events-none z-20"></div>
        </div>
    );
};

export default HeroCarousel;
