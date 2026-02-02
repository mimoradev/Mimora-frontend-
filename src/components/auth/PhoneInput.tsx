import React from 'react';

interface PhoneInputProps {
    countryCode: string;
    phoneNumber: string;
    onCountryCodeChange: (code: string) => void;
    onPhoneNumberChange: (phone: string) => void;
    error?: string;
    disabled?: boolean;
    compact?: boolean;
}

const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+971', country: 'UAE' },
    { code: '+65', country: 'Singapore' },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
    countryCode,
    phoneNumber,
    onCountryCodeChange,
    onPhoneNumberChange,
    error,
    disabled = false,
    compact = false,
}) => {
    const heightClass = compact ? 'h-10' : 'h-12';

    return (
        <div className="w-full">
            <div className="flex gap-3">
                {/* Country Code Label */}
                <div className="w-[90px]">
                    <label className="block text-xs text-gray-500 mb-1">
                        Country code
                    </label>
                    <select
                        value={countryCode}
                        onChange={(e) => onCountryCodeChange(e.target.value)}
                        disabled={disabled}
                        className={`
              auth-input
              w-full ${heightClass} px-3
              text-sm text-[#1E1E1E]
              bg-white
              border border-[#E0E0E0] rounded-xl
              cursor-pointer
              appearance-none
              disabled:bg-gray-50 disabled:cursor-default
            `}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 8px center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '16px',
                        }}
                    >
                        {countryCodes.map(({ code, country: _country }) => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phone Number */}
                <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                        Mobile number
                    </label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                            // Only allow numbers and limit to 10 digits
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            onPhoneNumberChange(value);
                        }}
                        placeholder="Eg. 86941 86903"
                        disabled={disabled}
                        maxLength={10}
                        className={`
              auth-input
              w-full ${heightClass} px-4
              text-sm text-[#1E1E1E]
              bg-white
              border rounded-xl
              placeholder:text-gray-400
              disabled:bg-gray-50 disabled:cursor-default
              ${error ? 'border-red-400' : 'border-[#E0E0E0]'}
            `}
                    />
                </div>
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default PhoneInput;

