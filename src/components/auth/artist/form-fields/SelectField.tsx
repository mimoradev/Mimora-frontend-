import React, { useState, useEffect, useRef } from 'react';

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
    required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, placeholder, error, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="space-y-1" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`relative border rounded-lg px-3 py-2 bg-white transition-all cursor-pointer ${error ? 'border-red-400' : isOpen ? 'border-[#E91E63] ring-1 ring-[#E91E63]/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
            >
                <label className="block text-xs text-gray-500">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center justify-between">
                    <span className={`text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selectedOption?.label || placeholder || 'Select an option'}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Custom Dropdown Menu */}
                {isOpen && (
                    <div
                        data-lenis-prevent
                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-[120px] overflow-y-auto"
                    >
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${value === opt.value
                                    ? 'bg-[#FCE4EC] text-[#E91E63] font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{opt.label}</span>
                                    {value === opt.value && (
                                        <svg className="w-4 h-4 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 px-1">{error}</p>}
        </div>
    );
};

export default SelectField;
