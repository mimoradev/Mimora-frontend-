import React from 'react';

type ProfileType = 'customer' | 'artist';

interface ProfileSelectorProps {
    selectedProfile: ProfileType | null;
    onSelect: (profile: ProfileType) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
    selectedProfile,
    onSelect,
}) => {
    const profiles: { type: ProfileType; label: string; activeImage: string; inactiveImage: string }[] = [
        {
            type: 'customer',
            label: 'Customer',
            activeImage: '/info/signup/1f5211b49139736759d9861eb66596ae13cd21fe.png', // Woman waving
            inactiveImage: '/info/signup/9c82cb2051e1fad67f144c57a6dffb7b41623026.png', // Woman holding phone
        },
        {
            type: 'artist',
            label: 'Artist',
            activeImage: '/info/signup/e705b35b34994bae6f7d848967bd7d99b164fd30.png', // Woman waving
            inactiveImage: '/info/signup/2ffa1250f7dec8acea993abfbe38ce323bbb5e4f.png', // Woman with makeup kit
        },
    ];

    return (
        <div className="space-y-4">
            {profiles.map(({ type, label, activeImage, inactiveImage }) => {
                const isSelected = selectedProfile === type;
                const currentImage = isSelected ? activeImage : inactiveImage;

                return (
                    <button
                        key={type}
                        onClick={() => onSelect(type)}
                        className={`
                            auth-profile-card
                            relative
                            w-full h-[120px]
                            flex items-center
                            px-5
                            rounded-2xl
                            border
                            text-left
                            overflow-hidden
                            transition-all duration-200
                            ${isSelected
                                ? 'border-[#1E1E1E] shadow-sm'
                                : 'bg-[#F5F5F5] border-transparent'
                            }
                        `}
                        style={isSelected ? {
                            background: 'radial-gradient(ellipse at right bottom, rgba(252, 231, 243, 0.8) 0%, rgba(255, 255, 255, 1) 60%)'
                        } : undefined}
                    >
                        {/* Radio indicator */}
                        <div className={`
                            w-6 h-6 rounded-full border-2 mr-4
                            flex items-center justify-center shrink-0
                            transition-colors duration-200
                            ${isSelected
                                ? 'border-[#1E1E1E]'
                                : 'border-gray-300'
                            }
                        `}>
                            {isSelected && (
                                <div className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                            )}
                        </div>

                        {/* Label */}
                        <span className="flex-1 text-base font-medium text-[#1E1E1E]">
                            {label}
                        </span>

                        {/* Character illustration - positioned from top, cropping at bottom */}
                        <div
                            className="absolute right-0 top-0 h-full overflow-hidden"
                            style={{ width: '180px' }}
                        >
                            <img
                                src={currentImage}
                                alt={label}
                                className="h-auto object-cover object-top"
                                style={{
                                    width: '180px',
                                    marginTop: '-10px',
                                    objectPosition: 'top center'
                                }}
                            />
                        </div>

                        {/* "Hi!" text for selected customer */}
                        {type === 'customer' && isSelected && (
                            <div
                                className="absolute z-10"
                                style={{
                                    right: '130px',
                                    top: '15px',
                                    fontFamily: 'cursive, sans-serif',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1E1E1E',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                HI!
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ProfileSelector;
