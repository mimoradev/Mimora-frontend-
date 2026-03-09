import React, { useEffect } from 'react';
import { useArtistSignup } from '../ArtistSignupContext';
import { BackArrowIcon } from '../icons';
import { PROFESSIONS, EVENT_TYPE_OPTIONS, SERVICE_LOCATION_OPTIONS, TRAVEL_WILLINGNESS_OPTIONS, TIME_PRESETS, TIME_OPTIONS } from '../artist-signup.types';
import ArtistProfilePreview from '@/components/auth/ArtistProfilePreview';

const BookingModesStep: React.FC = () => {
    const {
        formData, setFormStep,
        bookingMode, setBookingMode,
        bookingModeSubStep,
        selectedProfessions, toggleProfession,
        selectedEventTypes, toggleEventType,
        isEventDropdownOpen, setIsEventDropdownOpen, eventDropdownRef,
        skills, skillInput, setSkillInput,
        isSkillsModalOpen, setIsSkillsModalOpen,
        addSkill, removeSkill, getSkillSuggestions,
        serviceLocation, setServiceLocation,
        travelWillingness, toggleTravelWillingness,
        studioAddress, updateStudioAddress,
        workingHours, removeWorkingHour,
        isTimePickerOpen, setIsTimePickerOpen,
        timePeriodSelection, setTimePeriodSelection,
        customStartTime, setCustomStartTime,
        customEndTime, setCustomEndTime,
        handleTimePickerDone,
        handleBookingModeNext, handleBookingModeBack,
    } = useArtistSignup();

    // Close event dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (eventDropdownRef.current && !eventDropdownRef.current.contains(e.target as Node)) {
                setIsEventDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [eventDropdownRef, setIsEventDropdownOpen]);

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Left side - Form (70%) */}
            <div className="w-full md:w-[70%] pl-14 py-6 flex flex-col h-full">
                <div className="w-[90%] flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBookingModeBack} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50">
                                <BackArrowIcon />
                            </button>
                            <h1 className="text-xl font-semibold">Booking modes</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {bookingModeSubStep === 5 && (
                                <button
                                    onClick={() => setFormStep('method-select')}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={handleBookingModeNext}
                                disabled={
                                    (bookingModeSubStep === 1 && !bookingMode) ||
                                    (bookingModeSubStep === 2 && selectedProfessions.length === 0) ||
                                    (bookingModeSubStep === 3 && (selectedEventTypes.length === 0 || skills.length === 0)) ||
                                    (bookingModeSubStep === 4 && !serviceLocation)
                                }
                                className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${((bookingModeSubStep === 1 && bookingMode) ||
                                    (bookingModeSubStep === 2 && selectedProfessions.length > 0) ||
                                    (bookingModeSubStep === 3 && selectedEventTypes.length > 0 && skills.length > 0) ||
                                    (bookingModeSubStep === 4 && serviceLocation) ||
                                    bookingModeSubStep === 5)
                                    ? 'bg-gray-700 hover:bg-gray-800'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {bookingModeSubStep === 5 ? 'Submit' : bookingModeSubStep === 4 ? 'Save & continue' : 'Next'}
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6 shrink-0">
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-pink-500 rounded-full transition-all duration-300"
                                style={{ width: `${bookingModeSubStep * 20}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>Booking modes</span>
                        </div>
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto pr-4" data-lenis-prevent>
                        {bookingModeSubStep === 1 ? (
                            <>
                                <h2 className="text-2xl font-semibold mb-6">Choose your booking mode</h2>

                                {/* Booking mode options - Bento Grid */}
                                <div className="flex flex-wrap gap-6 px-4 mb-4">
                                    {/* Instant Booking */}
                                    <button
                                        onClick={() => setBookingMode('instant')}
                                        className={`relative rounded-2xl border-2 p-5 text-left transition-all w-[220px] h-[220px] flex flex-col justify-between overflow-hidden group ${bookingMode === 'instant'
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start w-full z-10">
                                            <h3 className="font-semibold text-lg text-gray-900 leading-tight">Instant Booking</h3>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${bookingMode === 'instant' ? 'border-gray-900' : 'border-gray-300'
                                                }`}>
                                                {bookingMode === 'instant' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-36 transition-transform group-hover:scale-105 duration-300">
                                            <img src="/info/signup/instant.png" alt="Instant Booking" className="w-full h-auto object-contain" />
                                        </div>
                                    </button>

                                    {/* Flexi Booking */}
                                    <button
                                        onClick={() => setBookingMode('flexi')}
                                        className={`relative rounded-2xl border-2 p-5 text-left transition-all w-[220px] h-[220px] flex flex-col justify-between overflow-hidden group ${bookingMode === 'flexi'
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start w-full z-10">
                                            <h3 className="font-semibold text-lg text-gray-900 leading-tight">Flexi Booking</h3>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${bookingMode === 'flexi' ? 'border-gray-900' : 'border-gray-300'
                                                }`}>
                                                {bookingMode === 'flexi' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-36 transition-transform group-hover:scale-105 duration-300">
                                            <img src="/info/signup/flexi.png" alt="Flexi Booking" className="w-full h-auto object-contain" />
                                        </div>
                                    </button>

                                    {/* Both */}
                                    <button
                                        onClick={() => setBookingMode('both')}
                                        className={`relative rounded-2xl border-2 p-5 text-left transition-all w-[220px] h-[220px] flex flex-col justify-between overflow-hidden group ${bookingMode === 'both'
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start w-full z-10">
                                            <h3 className="font-semibold text-lg text-gray-900 leading-tight">Both</h3>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${bookingMode === 'both' ? 'border-gray-900' : 'border-gray-300'
                                                }`}>
                                                {bookingMode === 'both' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 transition-transform group-hover:scale-105 duration-300">
                                            <img src="/info/signup/both.png" alt="Both" className="w-full h-auto object-contain" />
                                        </div>
                                    </button>
                                </div>

                                {/* Descriptions */}
                                <div className="space-y-3 text-sm text-gray-600 mt-8">
                                    <div>
                                        <span className="font-semibold text-gray-900">Instant Booking:</span>
                                        <br />
                                        Get booked right away for quick beauty needs. Example: touch-ups, simple makeup, etc.
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-900">Flexi Booking:</span>
                                        <br />
                                        Bigger events that needs bigger planning. Example: weddings, bridal, etc.
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-900">Both:</span>
                                        <br />
                                        You are ready to slay both the above.
                                    </div>
                                </div>
                            </>
                        ) : bookingModeSubStep === 2 ? (
                            <>
                                {/* Profession Selection */}
                                <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-2">What do you specialize in ?</h2>
                                <p className="text-sm text-gray-500 mb-8">Choose all that apply</p>

                                <div className="grid grid-cols-2 gap-5 max-w-lg">
                                    {PROFESSIONS.map((profession) => {
                                        const isSelected = selectedProfessions.includes(profession.id);
                                        return (
                                            <button
                                                key={profession.id}
                                                onClick={() => toggleProfession(profession.id)}
                                                className={`relative rounded-xl border-2 w-52 h-48 text-left transition-all hover:shadow-md overflow-hidden ${isSelected
                                                    ? 'border-gray-900 bg-gray-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 px-3.5 pt-3.5">
                                                    <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 ${isSelected
                                                        ? 'bg-gray-900 border-gray-900'
                                                        : 'bg-white border-gray-300'
                                                        }`}>
                                                        {isSelected && (
                                                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900">{profession.label}</p>
                                                </div>
                                                <div className="flex items-end justify-center h-36 pt-1">
                                                    <img src={profession.image} alt={profession.label} className="h-full w-auto object-contain object-bottom" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : bookingModeSubStep === 3 ? (
                            <>
                                {/* Sub-step 3: Event Types & Skills */}
                                <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-2">Event types & Skills</h2>
                                <p className="text-sm text-gray-500 mb-8">Tell us about the events you cover and your key skills</p>

                                <div className="space-y-8 max-w-lg">
                                    {/* Event Type Dropdown */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Event types you cover</label>
                                        <div className="relative" ref={eventDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                                                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl bg-white text-left hover:border-gray-400 transition-colors"
                                            >
                                                <span className={`text-sm ${selectedEventTypes.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {selectedEventTypes.length > 0
                                                        ? `${selectedEventTypes.length} event type${selectedEventTypes.length > 1 ? 's' : ''} selected`
                                                        : 'Select event types'}
                                                </span>
                                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isEventDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {isEventDropdownOpen && (
                                                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                    {EVENT_TYPE_OPTIONS.map((eventType) => {
                                                        const isSelected = selectedEventTypes.includes(eventType);
                                                        return (
                                                            <button
                                                                key={eventType}
                                                                type="button"
                                                                onClick={() => toggleEventType(eventType)}
                                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50' : ''}`}
                                                            >
                                                                <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}>
                                                                    {isSelected && (
                                                                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <span className="text-sm text-gray-900">{eventType}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {selectedEventTypes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedEventTypes.map((eventType) => (
                                                    <span key={eventType} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                                        {eventType}
                                                        <button type="button" onClick={() => toggleEventType(eventType)} className="text-gray-500 hover:text-gray-700">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills Input */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Your skills</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && skillInput.trim()) {
                                                        e.preventDefault();
                                                        addSkill(skillInput);
                                                    }
                                                }}
                                                onFocus={() => setIsSkillsModalOpen(true)}
                                                placeholder="Type a skill and press Enter"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                                            />
                                            {skillInput.trim() && (
                                                <button
                                                    type="button"
                                                    onClick={() => addSkill(skillInput)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            )}
                                        </div>

                                        {skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {skills.map((skill) => (
                                                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 border border-pink-200 text-xs font-medium rounded-full">
                                                        {skill}
                                                        <button type="button" onClick={() => removeSkill(skill)} className="text-pink-400 hover:text-pink-600">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {isSkillsModalOpen && getSkillSuggestions().length > 0 && (
                                            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Suggested skills</h4>
                                                    <button type="button" onClick={() => setIsSkillsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {getSkillSuggestions().map((suggestion) => (
                                                        <button
                                                            key={suggestion}
                                                            type="button"
                                                            onClick={() => addSkill(suggestion)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-xs font-medium text-gray-700 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : bookingModeSubStep === 4 ? (
                            <>
                                {/* Sub-step 4: Service Location */}
                                <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-8">Where do you provide your services?</h2>

                                <div className="flex flex-wrap gap-6 px-1">
                                    {SERVICE_LOCATION_OPTIONS.map((option) => {
                                        const isSelected = serviceLocation === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setServiceLocation(option.id)}
                                                className={`relative rounded-2xl border-2 p-5 text-left transition-all w-55 h-55 flex flex-col justify-between overflow-hidden group ${isSelected
                                                    ? 'border-gray-900 bg-gray-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2 w-full z-10">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-gray-900' : 'border-gray-300'}`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-base text-gray-900 leading-tight">{option.label}</h3>
                                                        {option.subtitle && <p className="text-xs text-gray-500 mt-0.5">{option.subtitle}</p>}
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 transition-transform group-hover:scale-105 duration-300">
                                                    <img src={option.image} alt={option.label} className="w-full h-auto object-contain" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Sub-step 5: Travel Willingness / Studio Address */}

                                {(serviceLocation === 'client' || serviceLocation === 'both') && (
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-8">How about your travel willingness?</h2>

                                        <div className="flex flex-wrap gap-6 px-1">
                                            {TRAVEL_WILLINGNESS_OPTIONS.map((option) => {
                                                const isSelected = travelWillingness.includes(option.id);
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => toggleTravelWillingness(option.id)}
                                                        className={`relative rounded-2xl border-2 p-5 text-left transition-all w-55 h-55 flex flex-col justify-between overflow-hidden group ${isSelected
                                                            ? 'border-gray-900 bg-gray-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 w-full z-10">
                                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}>
                                                                {isSelected && (
                                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <h3 className="font-semibold text-base text-gray-900 leading-tight">{option.label}</h3>
                                                        </div>
                                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 transition-transform group-hover:scale-105 duration-300">
                                                            <img src={option.image} alt={option.label} className="w-full h-auto object-contain" />
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {(serviceLocation === 'studio' || serviceLocation === 'both') && (
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-6">Studio Address</h2>

                                        <div className="space-y-4 max-w-lg">
                                            <div className="relative">
                                                <input type="text" value={studioAddress.shopNo} onChange={(e) => updateStudioAddress('shopNo', e.target.value)} placeholder=" " className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-500 transition-colors" />
                                                <label className="absolute left-4 top-2 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">Shop No</label>
                                            </div>
                                            <div className="relative">
                                                <input type="text" value={studioAddress.area} onChange={(e) => updateStudioAddress('area', e.target.value)} placeholder=" " className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-500 transition-colors" />
                                                <label className="absolute left-4 top-2 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">Area, Street, Sector, Village</label>
                                            </div>
                                            <div className="relative">
                                                <input type="text" value={studioAddress.landmark} onChange={(e) => updateStudioAddress('landmark', e.target.value)} placeholder=" " className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-500 transition-colors" />
                                                <label className="absolute left-4 top-2 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">Landmark</label>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="relative flex-1">
                                                    <input type="text" value={studioAddress.pincode} onChange={(e) => updateStudioAddress('pincode', e.target.value)} placeholder=" " className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-500 transition-colors" />
                                                    <label className="absolute left-4 top-2 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">Pincode</label>
                                                </div>
                                                <div className="relative flex-1">
                                                    <input type="text" value={studioAddress.city} onChange={(e) => updateStudioAddress('city', e.target.value)} placeholder=" " className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-500 transition-colors" />
                                                    <label className="absolute left-4 top-2 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">Town/City</label>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input type="text" value={studioAddress.state} onChange={(e) => updateStudioAddress('state', e.target.value)} placeholder=" " className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:border-gray-500 transition-colors" />
                                                <label className="absolute left-4 top-2 text-[10px] text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[10px]">State</label>
                                            </div>
                                        </div>

                                        {/* Studio Working Hours */}
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">Studio working hours (optional)</h3>

                                            <div className="space-y-2 mb-4">
                                                {workingHours.map((wh) => (
                                                    <div key={wh.period} className="inline-flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white mr-2">
                                                        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-900">
                                                            {wh.period === 'Any time' ? 'Any time' : `${wh.period} • ${wh.startTime} - ${wh.endTime}`}
                                                        </span>
                                                        <button type="button" onClick={() => removeWorkingHour(wh.period)} className="text-gray-400 hover:text-gray-600 ml-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setIsTimePickerOpen(true)}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add working hours
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Time Picker Modal */}
                        {isTimePickerOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
                                    <h3 className="text-lg font-semibold text-[#1E1E1E] mb-5">Select time</h3>

                                    <div className="flex gap-3 mb-3">
                                        {TIME_PRESETS.map((preset) => (
                                            <button
                                                key={preset.label}
                                                type="button"
                                                onClick={() => setTimePeriodSelection(preset.label)}
                                                className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-center transition-all ${timePeriodSelection === preset.label ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <p className="text-sm font-medium text-gray-900">{preset.label}</p>
                                                <p className="text-[10px] text-gray-500">{preset.startTime} - {preset.endTime}</p>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 mb-5">
                                        <button type="button" onClick={() => setTimePeriodSelection('Custom')} className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-center transition-all ${timePeriodSelection === 'Custom' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <p className="text-sm font-medium text-gray-900">Custom</p>
                                        </button>
                                        <button type="button" onClick={() => setTimePeriodSelection('Any time')} className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-center transition-all ${timePeriodSelection === 'Any time' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <p className="text-sm font-medium text-gray-900">Any time</p>
                                        </button>
                                    </div>

                                    {timePeriodSelection === 'Custom' && (
                                        <div className="flex gap-3 mb-5">
                                            <div className="flex-1">
                                                <select value={customStartTime} onChange={(e) => setCustomStartTime(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500">
                                                    <option value="">Select start time</option>
                                                    {TIME_OPTIONS.map((t) => (<option key={`start-${t}`} value={t}>{t}</option>))}
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <select value={customEndTime} onChange={(e) => setCustomEndTime(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-500">
                                                    <option value="">Select end time</option>
                                                    {TIME_OPTIONS.map((t) => (<option key={`end-${t}`} value={t}>{t}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { setIsTimePickerOpen(false); setTimePeriodSelection(''); setCustomStartTime(''); setCustomEndTime(''); }}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleTimePickerDone}
                                            disabled={!timePeriodSelection || (timePeriodSelection === 'Custom' && (!customStartTime || !customEndTime))}
                                            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${timePeriodSelection && !(timePeriodSelection === 'Custom' && (!customStartTime || !customEndTime))
                                                ? 'bg-gray-900 hover:bg-gray-800'
                                                : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right side - Profile Preview (30%) */}
            <div className="w-0 md:w-[30%] border-l border-gray-200 hidden lg:block">
                <div className="h-10 bg-linear-to-b from-pink-100 to-white"></div>
                <div className="p-6">
                    <ArtistProfilePreview
                        name={formData.fullName}
                        profilePicUrl={formData.profilePicUrl}
                        profession={selectedProfessions.map(id => PROFESSIONS.find(p => p.id === id)?.label || '').filter(Boolean)}
                        bio={formData.bio}
                        kycVerified={formData.kycStatus === 'verified'}
                        certificateUrl={formData.certificateUrl}
                        city={formData.address.city}
                        state={formData.address.state}
                        street={formData.address.street}
                        skills={skills}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingModesStep;
