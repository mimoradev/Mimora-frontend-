import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star } from 'lucide-react';

export interface ArtistBadge {
    type: 'kyc' | 'certified' | 'self-learned' | 'apprenticeship';
    label: string;
}

export interface ArtistData {
    id: string;
    name: string;
    avatarColor: string;
    specialty: string;
    badges: ArtistBadge[];
    distance: string;
    experience: string;
    rating: string;
    portfolioColors: string[];
}

interface ArtistCardProps {
    artist: ArtistData;
    buttonText: 'View Package' | 'Book Again';
    index?: number;
}

const getBadgeStyles = (type: ArtistBadge['type']) => {
    switch (type) {
        case 'kyc':
            return 'bg-[#1E1E1E] text-white';
        case 'certified':
            return 'bg-[#22C55E] text-white';
        case 'self-learned':
            return 'bg-[#3B82F6] text-white';
        case 'apprenticeship':
            return 'bg-[#F59E0B] text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, buttonText, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="shrink-0 w-[280px] bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer transition-shadow hover:shadow-lg"
        >
            {/* Header: Avatar + Info */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar Placeholder */}
                <div
                    className="w-12 h-12 rounded-full shrink-0"
                    style={{ backgroundColor: artist.avatarColor }}
                />

                {/* Name and Badges */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[15px] font-semibold text-[#1E1E1E] truncate">
                            {artist.name}
                        </h3>
                        {/* Badges */}
                        {artist.badges.map((badge, idx) => (
                            <span
                                key={idx}
                                className={`px-1.5 py-0.5 text-[8px] font-bold uppercase rounded ${getBadgeStyles(badge.type)}`}
                            >
                                {badge.label}
                            </span>
                        ))}
                    </div>
                    <p className="text-[12px] text-[#6B6B6B] mt-0.5">{artist.specialty}</p>
                </div>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-4 text-[11px] text-[#6B6B6B] mb-3">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{artist.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{artist.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#1E1E1E] text-[#1E1E1E]" />
                    <span>{artist.rating}</span>
                </div>
            </div>

            {/* Action Button */}
            <button className="w-full h-10 bg-white border border-gray-200 rounded-full text-[13px] font-medium text-[#1E1E1E] hover:bg-gray-50 transition-colors mb-3">
                {buttonText}
            </button>

            {/* Portfolio Thumbnails */}
            <div className="flex gap-2">
                {artist.portfolioColors.slice(0, 4).map((color, idx) => (
                    <div
                        key={idx}
                        className="flex-1 aspect-square rounded-lg"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default ArtistCard;
