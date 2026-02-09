import React from 'react';
import { Search, Calendar, Clock } from 'lucide-react';

const SearchOverlay: React.FC = () => {
    return (
        <div className="relative z-30 -mt-24 mx-auto px-4" style={{ maxWidth: '580px' }}>
            <div className="bg-white rounded-2xl shadow-xl p-6" style={{ boxShadow: '0 8px 40px rgba(0, 0, 0, 0.1)' }}>
                {/* Location Input */}
                <div className="relative mb-4">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Search className="w-5 h-5 text-[#6B6B6B]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Where should we come?"
                        className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-100 text-[14px] text-[#1E1E1E] placeholder-[#9B9B9B] focus:outline-none focus:border-[#E84A7F] focus:bg-white transition-all"
                    />
                </div>

                {/* Date and Time Row */}
                <div className="flex gap-3 mb-4">
                    {/* Date Picker */}
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Calendar className="w-5 h-5 text-[#6B6B6B]" />
                        </div>
                        <input
                            type="text"
                            placeholder="When"
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-100 text-[14px] text-[#1E1E1E] placeholder-[#9B9B9B] focus:outline-none focus:border-[#E84A7F] focus:bg-white transition-all"
                        />
                    </div>

                    {/* Time Picker */}
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Clock className="w-5 h-5 text-[#6B6B6B]" />
                        </div>
                        <input
                            type="text"
                            placeholder="What time?"
                            className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-100 text-[14px] text-[#1E1E1E] placeholder-[#9B9B9B] focus:outline-none focus:border-[#E84A7F] focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Find Artist Button */}
                <button className="w-full h-12 bg-[#1E1E1E] text-white rounded-xl flex items-center justify-center gap-2 font-medium text-[14px] hover:bg-[#2a2a2a] transition-colors active:scale-[0.98]">
                    <Search className="w-4 h-4" />
                    <span>Find an artist</span>
                </button>
            </div>
        </div>
    );
};

export default SearchOverlay;
