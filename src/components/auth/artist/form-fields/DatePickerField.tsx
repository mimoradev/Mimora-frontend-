import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';

interface DatePickerFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    helperText?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    value,
    onChange,
    error,
    required = false,
    helperText,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        // Parse existing value or use 18 years ago as default
        if (value) {
            const [day, month, year] = value.split('/').map(Number);
            if (day && month && year) {
                return new Date(year, month - 1, day);
            }
        }
        const date = new Date();
        date.setFullYear(date.getFullYear() - 18);
        return date;
    });
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const handlePrevMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleSelectDate = (day: number) => {
        const formatted = `${String(day).padStart(2, '0')}/${String(viewDate.getMonth() + 1).padStart(2, '0')}/${viewDate.getFullYear()}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const { firstDay, daysInMonth } = getDaysInMonth(viewDate);
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    // Parse selected date
    const selectedParts = value?.split('/').map(Number);
    const selectedDate = selectedParts?.length === 3
        ? new Date(selectedParts[2], selectedParts[1] - 1, selectedParts[0])
        : null;

    const isDateDisabled = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return date > maxDate;
    };

    return (
        <div className="relative space-y-1" ref={containerRef}>
            <div
                className={`relative border rounded-lg px-3 py-2 bg-white transition-colors cursor-pointer ${error ? 'border-red-400' : isOpen ? 'border-[#E91E63]' : 'border-gray-200'
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <label className="block text-xs text-gray-500">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-2">
                    <span className={`flex-1 text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                        {value || 'DD/MM/YYYY'}
                    </span>
                    <CalendarIcon />
                </div>
            </div>

            {/* Calendar Dropdown - positioned above the input */}
            {isOpen && (
                <div className="absolute z-50 bottom-full mb-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-[300px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {/* Header with Month/Year Dropdowns */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeftIcon />
                        </button>

                        {/* Month Dropdown */}
                        <select
                            value={viewDate.getMonth()}
                            onChange={(e) => {
                                e.stopPropagation();
                                setViewDate(prev => new Date(prev.getFullYear(), parseInt(e.target.value), 1));
                            }}
                            className="text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-gray-100 transition-colors outline-none focus:border-[#E91E63]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {months.map((month, index) => (
                                <option key={month} value={index}>{month}</option>
                            ))}
                        </select>

                        {/* Year Dropdown */}
                        <select
                            value={viewDate.getFullYear()}
                            onChange={(e) => {
                                e.stopPropagation();
                                setViewDate(prev => new Date(parseInt(e.target.value), prev.getMonth(), 1));
                            }}
                            className="text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-gray-100 transition-colors outline-none focus:border-[#E91E63]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {Array.from({ length: maxDate.getFullYear() - 1940 + 1 }, (_, i) => 1940 + i).reverse().map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleNextMonth(); }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-xs text-gray-400 text-center py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before first */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-8 h-8" />
                        ))}
                        {/* Day cells */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = selectedDate?.getDate() === day &&
                                selectedDate?.getMonth() === viewDate.getMonth() &&
                                selectedDate?.getFullYear() === viewDate.getFullYear();
                            const isToday = today.getDate() === day &&
                                today.getMonth() === viewDate.getMonth() &&
                                today.getFullYear() === viewDate.getFullYear();
                            const disabled = isDateDisabled(day);

                            return (
                                <button
                                    key={day}
                                    onClick={(e) => { e.stopPropagation(); if (!disabled) handleSelectDate(day); }}
                                    disabled={disabled}
                                    className={`w-8 h-8 text-sm rounded-lg transition-all duration-150 ${isSelected
                                        ? 'bg-[#E91E63] text-white font-semibold'
                                        : disabled
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : isToday
                                                ? 'border border-[#E91E63] text-[#E91E63] hover:bg-pink-50'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {error ? (
                <p className="text-xs text-red-500 px-1">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-gray-400 px-1">{helperText}</p>
            ) : null}
        </div>
    );
};

export default DatePickerField;
