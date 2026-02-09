import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArtistCard from './ArtistCard';
import type { ArtistData } from './ArtistCard';

interface ArtistSectionProps {
    title: string;
    artists: ArtistData[];
    buttonText: 'View Package' | 'Book Again';
}

const ArtistSection: React.FC<ArtistSectionProps> = ({ title, artists, buttonText }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 300; // Scroll by one card width approximately
        const newScrollPosition = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth'
        });
    };

    return (
        <section className="py-8 px-4 md:px-10">
            <div className="max-w-[1440px] mx-auto">
                {/* Section Header with Navigation Arrows */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[18px] md:text-[20px] font-semibold text-[#1E1E1E]">
                        {title}
                    </h2>

                    {/* Navigation Arrows - Right Side */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-[#6B6B6B]" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-[#6B6B6B]" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Cards Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                    style={{
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {artists.map((artist, index) => (
                        <div key={artist.id} className="snap-start">
                            <ArtistCard
                                artist={artist}
                                buttonText={buttonText}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ArtistSection;
