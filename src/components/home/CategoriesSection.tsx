import React from 'react';
import { motion } from 'framer-motion';

interface Category {
    id: string;
    name: string;
    color: string;
}

const CategoriesSection: React.FC = () => {
    // Categories with placeholder colors for icons
    const categories: Category[] = [
        { id: 'makeup', name: 'Makeup', color: '#FFB6C1' },
        { id: 'nail', name: 'Nail', color: '#DDA0DD' },
        { id: 'hairstylist', name: 'Hairstylist', color: '#F0E68C' },
        { id: 'saree-draping', name: 'Saree Draping', color: '#FFA07A' },
        { id: 'saree-pleating', name: 'Saree Pleating', color: '#98FB98' },
        { id: 'mehendi', name: 'Mehendi', color: '#87CEEB' },
    ];

    return (
        <section className="py-10 px-4 md:px-10">
            <div className="max-w-[1440px] mx-auto">
                {/* Section Title */}
                <h2 className="text-[18px] md:text-[20px] font-semibold text-[#1E1E1E] mb-6">
                    Categories
                </h2>

                {/* Categories Grid - Horizontal scroll on mobile, grid on desktop */}
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide md:overflow-visible md:flex-wrap">
                    {categories.map((category, index) => (
                        <motion.button
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer"
                        >
                            {/* Icon Placeholder - Circular with color */}
                            <div
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
                                style={{ backgroundColor: category.color }}
                            >
                                {/* Placeholder for illustration */}
                                <span className="text-white/70 text-xs font-medium text-center px-2">
                                    {category.name}
                                </span>
                            </div>

                            {/* Category Label */}
                            <span className="text-[13px] md:text-[14px] font-medium text-[#1E1E1E] group-hover:text-[#E84A7F] transition-colors">
                                {category.name}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
