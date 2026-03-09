import React from 'react';

interface TextareaFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    maxLength?: number;
    helperText?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    maxLength = 500,
    helperText,
}) => (
    <div className="space-y-1">
        <div className={`relative border rounded-lg px-3 py-2 bg-white transition-colors ${error ? 'border-red-400 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#E91E63]'}`}>
            <div className="flex items-center justify-between">
                <label className="block text-xs text-gray-500">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <span className="text-xs text-gray-400">{value.length}/{maxLength}</span>
            </div>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className="w-full text-sm text-gray-900 bg-transparent outline-none resize-none placeholder:text-gray-400"
            />
        </div>
        {error ? (
            <p className="text-xs text-red-500 px-1">{error}</p>
        ) : helperText ? (
            <p className="text-xs text-gray-400 px-1">{helperText}</p>
        ) : null}
    </div>
);

export default TextareaField;
