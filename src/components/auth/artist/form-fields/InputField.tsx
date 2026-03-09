import React from 'react';

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    disabled?: boolean;
    suffix?: React.ReactNode;
    helperText?: string;
    error?: string;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    disabled = false,
    suffix,
    helperText,
    error,
    required = false,
}) => (
    <div className="space-y-1">
        <div className={`relative border rounded-lg px-3 py-2 bg-white transition-colors ${error ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#E91E63]'}`}>
            <label className="block text-xs text-gray-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-2">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400 disabled:text-gray-500"
                />
                {suffix}
            </div>
        </div>
        {error ? (
            <p className="text-xs text-red-500 px-1">{error}</p>
        ) : helperText ? (
            <p className="text-xs text-gray-400 px-1">{helperText}</p>
        ) : null}
    </div>
);

export default InputField;
