import React from 'react';

interface PhoneInputFieldProps {
    countryCode: string;
    phone: string;
    onCountryCodeChange: (code: string) => void;
    onPhoneChange: (phone: string) => void;
    verified?: boolean;
    onVerifyClick?: () => void;
    showVerify?: boolean;
    error?: string;
    required?: boolean;
    isLoading?: boolean;
    canVerify?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
    countryCode,
    phone,
    onCountryCodeChange,
    onPhoneChange,
    verified,
    onVerifyClick,
    showVerify = true,
    error,
    required = false,
    isLoading = false,
    canVerify = false,
}) => (
    <div className="space-y-1">
        <div className="flex gap-2">
            <div className={`w-20 border rounded-lg px-3 py-2 bg-white transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}>
                <label className="block text-xs text-gray-500">Country code</label>
                <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => onCountryCodeChange(e.target.value)}
                    className="w-full text-sm text-gray-900 bg-transparent outline-none"
                />
            </div>
            <div className={`flex-1 border rounded-lg px-3 py-2 bg-white transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}>
                <label className="block text-xs text-gray-500">
                    Mobile number {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="tel"
                        placeholder="Eg. 86941 86903"
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
                    />
                    {showVerify && (
                        <button
                            onClick={onVerifyClick}
                            disabled={isLoading || (!canVerify && !verified)}
                            className={`text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${verified
                                ? 'text-emerald-600'
                                : isLoading
                                    ? 'text-[#E91E63]'
                                    : canVerify
                                        ? 'text-[#E91E63] hover:text-[#C2185B]'
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : verified ? (
                                '✓ Verified'
                            ) : (
                                'Verify'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
        {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
);

export default PhoneInputField;
