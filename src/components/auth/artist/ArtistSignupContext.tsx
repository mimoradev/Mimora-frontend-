import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { auth as firebaseAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errorHandling';
import { uploadProfilePicture, uploadPortfolioImage } from '@/services/uploadService';

import type {
    SignupMethod,
    FormStep,
    FormData,
    StudioAddress,
    BankDetailsData,
    WorkingHour,
    SetupSteps,
} from './artist-signup.types';

import {
    INITIAL_FORM_DATA,
    INITIAL_BANK_DETAILS,
    INITIAL_STUDIO_ADDRESS,
    INITIAL_SETUP_STEPS,
    TIME_PRESETS,
} from './artist-signup.types';

// ─── Context Value Interface ─────────────────────────────────────────
interface ArtistSignupContextValue {
    // Navigation
    navigate: ReturnType<typeof useNavigate>;

    // Auth context values
    isLoading: boolean;
    error: string | null;

    // Form step state
    signupMethod: SignupMethod;
    setSignupMethod: React.Dispatch<React.SetStateAction<SignupMethod>>;
    formStep: FormStep;
    setFormStep: React.Dispatch<React.SetStateAction<FormStep>>;
    subStep: number;
    setSubStep: React.Dispatch<React.SetStateAction<number>>;

    // Setup steps
    setupSteps: SetupSteps;
    setSetupSteps: React.Dispatch<React.SetStateAction<SetupSteps>>;
    activeStep: number;

    // Form data
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    updateFormData: (updates: Partial<FormData>) => void;

    // Validation
    touchedFields: Partial<Record<keyof FormData, boolean>>;
    getFieldError: (field: keyof FormData) => string;
    isFormValid: () => boolean;

    // Saving state
    isSaving: boolean;
    showSuccess: boolean;
    setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;

    // Phone/Email OTP
    phoneVerified: boolean;
    emailVerified: boolean;
    otpSent: boolean;
    otpSending: boolean;
    otpError: string;
    otpSuccess: string;

    // Image upload
    isUploadingImage: boolean;
    profilePicInputRef: React.RefObject<HTMLInputElement | null>;

    // Geolocation
    geoLocation: { latitude: number; longitude: number } | null;
    geoLoading: boolean;
    geoError: string | null;
    requestLocation: () => void;
    locationCaptured: boolean;

    // Booking mode (Step 2)
    bookingMode: 'instant' | 'flexi' | 'both' | '';
    setBookingMode: React.Dispatch<React.SetStateAction<'instant' | 'flexi' | 'both' | ''>>;
    bookingModeSubStep: 1 | 2 | 3 | 4 | 5;
    setBookingModeSubStep: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;

    // Professions
    selectedProfessions: string[];
    toggleProfession: (professionId: string) => void;

    // Event types & skills
    selectedEventTypes: string[];
    toggleEventType: (eventType: string) => void;
    isEventDropdownOpen: boolean;
    setIsEventDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    skills: string[];
    skillInput: string;
    setSkillInput: React.Dispatch<React.SetStateAction<string>>;
    isSkillsModalOpen: boolean;
    setIsSkillsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    addSkill: (skill: string) => void;
    removeSkill: (skill: string) => void;
    getSkillSuggestions: () => string[];
    eventDropdownRef: React.RefObject<HTMLDivElement | null>;

    // Service location
    serviceLocation: 'client' | 'studio' | 'both' | '';
    setServiceLocation: React.Dispatch<React.SetStateAction<'client' | 'studio' | 'both' | ''>>;

    // Travel willingness
    travelWillingness: string[];
    toggleTravelWillingness: (id: string) => void;

    // Studio address
    studioAddress: StudioAddress;
    updateStudioAddress: (field: string, value: string) => void;

    // Working hours
    workingHours: WorkingHour[];
    isTimePickerOpen: boolean;
    setIsTimePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    timePeriodSelection: string;
    setTimePeriodSelection: React.Dispatch<React.SetStateAction<string>>;
    customStartTime: string;
    setCustomStartTime: React.Dispatch<React.SetStateAction<string>>;
    customEndTime: string;
    setCustomEndTime: React.Dispatch<React.SetStateAction<string>>;
    addWorkingHour: (period: string, startTime: string, endTime: string) => void;
    removeWorkingHour: (period: string) => void;
    handleTimePickerDone: () => void;

    // Portfolio (Step 3)
    portfolioImages: string[];
    isUploadingPortfolio: boolean;
    draggedIndex: number | null;
    portfolioInputRef: React.RefObject<HTMLInputElement | null>;
    handlePortfolioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePortfolioDelete: (index: number) => void;
    handlePortfolioDragStart: (index: number) => void;
    handlePortfolioDragOver: (e: React.DragEvent, index: number) => void;
    handlePortfolioDragEnd: () => void;
    handlePortfolioSave: () => Promise<void>;

    // Bank Details (Step 4)
    bankDetails: BankDetailsData;
    handleBankFieldChange: (field: keyof BankDetailsData, value: string) => void;
    handleBankClear: () => void;
    handleBankSave: () => Promise<void>;
    bankAccountMatch: boolean;
    upiValid: boolean;
    bankFilledCount: number;
    bankProgress: number;
    canSubmitBank: boolean;

    // KYC Verification
    kycLoading: boolean;
    faceVerificationLoading: boolean;
    artistId: string | null;
    handleStartKYC: () => Promise<void>;
    handleStartFaceVerification: () => Promise<void>;
    handleCheckKYCStatus: () => Promise<void>;
    handleRetryKYC: () => Promise<void>;

    // Handlers
    handlePhoneSignup: () => void;
    handleEmailSignup: () => void;
    handleGoogleSignup: () => Promise<void>;
    handleProfilePicUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveProfilePic: () => void;
    handleSendPhoneOTP: () => Promise<void>;
    handleVerifyPhoneOTP: () => Promise<void>;
    handleSendEmailOTP: () => Promise<void>;
    handleVerifyEmailOTP: () => Promise<void>;
    handleBack: () => void;
    handleSaveAndContinue: () => Promise<void>;
    handleClear: () => void;
    handleStepContinue: (step: number) => void;
    handleBookingModeNext: () => void;
    handleBookingModeSave: () => Promise<void>;
    handleBookingModeBack: () => void;

    // Scroll refs
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const ArtistSignupContext = createContext<ArtistSignupContextValue | null>(null);

export const useArtistSignup = (): ArtistSignupContextValue => {
    const ctx = useContext(ArtistSignupContext);
    if (!ctx) throw new Error('useArtistSignup must be used within ArtistSignupProvider');
    return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────
export const ArtistSignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { sendPhoneOTP, verifyPhoneOTP, sendEmailOTP, isLoading, error, setUserType, updateUser, user } = useAuth();

    // Set user type to artist on mount
    useEffect(() => {
        setUserType('artist');
    }, [setUserType]);

    // Redirect completed artists to home (prevents stuck state)
    useEffect(() => {
        if (user && 'username' in user && (user as any).profile_completed) {
            navigate('/artist/home', { replace: true });
        }
    }, [user, navigate]);

    // ─── State ───────────────────────────────────────────────────────
    const [signupMethod, setSignupMethod] = useState<SignupMethod>(null);
    const [formStep, setFormStep] = useState<FormStep>('method-select');

    // Track which setup steps are completed (persisted in localStorage)
    const [setupSteps, setSetupSteps] = useState<SetupSteps>(() => {
        try {
            const saved = localStorage.getItem('artist_setup_steps');
            return saved ? JSON.parse(saved) : { ...INITIAL_SETUP_STEPS };
        } catch {
            return { ...INITIAL_SETUP_STEPS };
        }
    });

    // Persist setup step state
    useEffect(() => {
        localStorage.setItem('artist_setup_steps', JSON.stringify(setupSteps));
    }, [setupSteps]);

    const [subStep, setSubStep] = useState<number>(1);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpError, setOtpError] = useState<string>('');
    const [otpSuccess, setOtpSuccess] = useState<string>('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const { location: geoLocation, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
    const [locationCaptured, setLocationCaptured] = useState(false);

    // Booking mode state (Step 2)
    const [bookingMode, setBookingMode] = useState<'instant' | 'flexi' | 'both' | ''>('');
    const [bookingModeSubStep, setBookingModeSubStep] = useState<1 | 2 | 3 | 4 | 5>(1);

    // Selected professions (multi-select)
    const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);

    // Event types & skills (Sub-step 3)
    const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

    // Service location (Sub-step 4)
    const [serviceLocation, setServiceLocation] = useState<'client' | 'studio' | 'both' | ''>('');

    // Travel willingness (Sub-step 5 - when client/both)
    const [travelWillingness, setTravelWillingness] = useState<string[]>([]);

    // Studio address (Sub-step 5 - when studio/both)
    const [studioAddress, setStudioAddress] = useState<StudioAddress>({ ...INITIAL_STUDIO_ADDRESS });

    // Working hours (Sub-step 5 - when studio/both)
    const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [timePeriodSelection, setTimePeriodSelection] = useState('');
    const [customStartTime, setCustomStartTime] = useState('');
    const [customEndTime, setCustomEndTime] = useState('');

    // Portfolio state (Step 3)
    const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
    const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const portfolioInputRef = useRef<HTMLInputElement>(null);

    // Bank Details state (Step 4)
    const [bankDetails, setBankDetails] = useState<BankDetailsData>({ ...INITIAL_BANK_DETAILS });

    // KYC state
    const [kycLoading, setKycLoading] = useState(false);
    const [faceVerificationLoading, setFaceVerificationLoading] = useState(false);
    const [artistId, setArtistId] = useState<string | null>(null);

    // Form data
    const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM_DATA });

    // Validation state
    const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof FormData, boolean>>>({});

    // Ref for event dropdown click-outside
    const eventDropdownRef = useRef<HTMLDivElement>(null);

    // Scroll refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // ─── Lenis scroll setup ──────────────────────────────────────────
    useEffect(() => {
        if (!scrollContainerRef.current || !contentRef.current) return;

        const lenis = new Lenis({
            wrapper: scrollContainerRef.current,
            content: contentRef.current,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            syncTouch: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [formStep]);

    // ─── State Restoration ───────────────────────────────────────────
    const restoreStateFromArtist = (artist: any) => {
        setFormData(prev => ({
            ...prev,
            fullName: artist.name || prev.fullName,
            email: artist.email || prev.email,
            phone: artist.phone_number?.replace(/^\+91/, '') || prev.phone,
            bio: artist.bio || prev.bio,
            gender: artist.gender || prev.gender,
            experience: artist.experience || prev.experience,
            profilePicUrl: artist.profile_pic_url || prev.profilePicUrl,
            howDidYouLearn: artist.how_did_you_learn || prev.howDidYouLearn,
            certificateUrl: artist.certificate_url || prev.certificateUrl,
            kycStatus: artist.kyc_verified ? 'verified' as const : prev.kycStatus,
            address: {
                flatNo: artist.flat_building || prev.address.flatNo,
                street: artist.street_area || prev.address.street,
                landmark: artist.landmark || prev.address.landmark,
                pincode: artist.pincode || prev.address.pincode,
                city: artist.city || prev.address.city,
                state: artist.state || prev.address.state,
            },
        }));

        if (artist.booking_mode && !bookingMode) setBookingMode(artist.booking_mode);
        if (artist.profession?.length && selectedProfessions.length === 0) setSelectedProfessions(artist.profession);
        if (artist.event_types?.length && selectedEventTypes.length === 0) setSelectedEventTypes(artist.event_types);
        if (artist.skills?.length && skills.length === 0) setSkills(artist.skills);
        if (artist.service_location && !serviceLocation) setServiceLocation(artist.service_location);
        if (artist.travel_willingness?.length && travelWillingness.length === 0) setTravelWillingness(artist.travel_willingness);
        if (artist.studio_address) {
            try { setStudioAddress(JSON.parse(artist.studio_address)); } catch { /* ignore */ }
        }
        if (artist.working_hours) {
            try { setWorkingHours(JSON.parse(artist.working_hours)); } catch { /* ignore */ }
        }
        if (artist.portfolio?.length && portfolioImages.length === 0) {
            setPortfolioImages(artist.portfolio);
        }
        if (artist.bank_account_name) {
            setBankDetails(prev => ({
                ...prev,
                accountHolderName: artist.bank_account_name || '',
                accountNumber: artist.bank_account_number || '',
                confirmAccountNumber: artist.bank_account_number || '',
                bankName: artist.bank_name || '',
                ifscCode: artist.bank_ifsc || '',
                upiId: artist.upi_id || '',
            }));
        }
    };

    const fetchAndRestoreProfile = async () => {
        try {
            const artist = await authService.getCurrentArtist();
            localStorage.setItem('user', JSON.stringify(artist));
            restoreStateFromArtist(artist);
            console.log('Fetched and restored artist profile from backend');
        } catch (error: any) {
            console.error('Failed to fetch artist profile:', error);
            toast.error('Failed to load profile data. Please refresh the page.');
        }
    };

    // Load saved progress from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('artist_signup_data');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                if (progress.formData) setFormData(progress.formData);
                if (progress.subStep) setSubStep(progress.subStep);
                if (progress.formStep) setFormStep(progress.formStep);
                if (progress.signupMethod) setSignupMethod(progress.signupMethod);
                if (progress.phoneVerified) setPhoneVerified(progress.phoneVerified);
                if (progress.emailVerified) setEmailVerified(progress.emailVerified);
                console.log('Loaded saved progress:', progress);
            } catch (e) {
                console.error('Failed to parse saved progress:', e);
            }
        }

        const savedUser = localStorage.getItem('user');
        const firebaseToken = localStorage.getItem('firebaseToken');

        if (savedUser) {
            try {
                const artist = JSON.parse(savedUser);
                restoreStateFromArtist(artist);
                console.log('Restored artist profile data from localStorage');
            } catch (error) {
                console.error('Failed to parse localStorage user, fetching from backend:', error);
                if (firebaseToken) {
                    fetchAndRestoreProfile();
                } else {
                    console.log('User not authenticated, skipping backend fetch');
                }
            }
        } else if (firebaseToken) {
            console.log('No localStorage user found but authenticated, fetching from backend');
            fetchAndRestoreProfile();
        } else {
            console.log('New user signup flow, no profile to restore');
        }
    }, []);

    // ─── Extract artist ID from user ─────────────────────────────────
    useEffect(() => {
        // Try from AuthContext user first
        if (user) {
            const u = user as any;
            const id = u.id || u.uid || u.firebase_uid;
            if (id) {
                setArtistId(id);
                return;
            }
        }
        // Fallback: try from localStorage
        try {
            const saved = localStorage.getItem('user');
            if (saved) {
                const parsed = JSON.parse(saved);
                const id = parsed.id || parsed.uid || parsed.firebase_uid;
                if (id) {
                    setArtistId(id);
                    return;
                }
            }
        } catch { /* ignore */ }

        // Last resort: if we have a firebaseToken but no artistId, fetch from backend
        const firebaseToken = localStorage.getItem('firebaseToken');
        if (firebaseToken) {
            authService.getCurrentArtist().then(artist => {
                if (artist && artist.id) {
                    setArtistId(artist.id);
                    updateUser(artist as any);
                    localStorage.setItem('user', JSON.stringify(artist));
                }
            }).catch(() => {
                // Artist doesn't exist in backend yet — that's OK during early signup
            });
        }
    }, [user]);

    // ─── KYC Handlers ────────────────────────────────────────────────
    // Helper: save full signup progress before any redirect
    const saveProgressBeforeRedirect = useCallback(() => {
        const progress = {
            formData,
            subStep: 2, // KYC is on sub-step 2
            formStep: 'details-form' as const,
            signupMethod,
            phoneVerified,
            emailVerified,
        };
        localStorage.setItem('artist_signup_data', JSON.stringify(progress));
    }, [formData, signupMethod, phoneVerified, emailVerified]);

    const handleCheckKYCStatus = useCallback(async () => {
        if (!artistId) return;
        try {
            setKycLoading(true);
            const status = await authService.getKYCStatus(artistId);

            // Handle cancelled status — reset to not_started
            if (status.kyc_status === 'cancelled') {
                setFormData(prev => ({ ...prev, kycStatus: 'not_started' as const }));
                toast.info('Previous KYC was cancelled. You can start again.');
                return;
            }

            setFormData(prev => ({
                ...prev,
                kycStatus: status.kyc_verified ? 'verified' as const : (status.kyc_status as FormData['kycStatus']) || prev.kycStatus,
                faceVerified: status.face_verified,
            }));
        } catch (error: any) {
            console.error('Failed to check KYC status:', error);
        } finally {
            setKycLoading(false);
        }
    }, [artistId]);

    const handleStartKYC = useCallback(async () => {
        if (!artistId) {
            toast.error('Please complete authentication first before verifying KYC.');
            return;
        }
        try {
            setKycLoading(true);
            const response = await authService.startKYC(artistId);

            if (response.status === 'already_verified') {
                setFormData(prev => ({ ...prev, kycStatus: 'verified' }));
                toast.success('KYC already verified!');
                return;
            }

            if (response.status === 'in_progress' && response.kyc_url) {
                setFormData(prev => ({ ...prev, kycStatus: 'in_progress' }));
                saveProgressBeforeRedirect();
                window.location.href = response.kyc_url;
                return;
            }

            if (response.status === 'initiated' && response.kyc_url) {
                setFormData(prev => ({ ...prev, kycStatus: 'in_progress' }));
                saveProgressBeforeRedirect();
                window.location.href = response.kyc_url;
            } else {
                toast.error('Failed to initiate KYC. Please try again.');
            }
        } catch (error: any) {
            console.error('KYC initiation error:', error);
            toast.error(error.message || 'Failed to start KYC verification.');
        } finally {
            setKycLoading(false);
        }
    }, [artistId, saveProgressBeforeRedirect]);

    const handleStartFaceVerification = useCallback(async () => {
        if (!artistId) {
            toast.error('Please complete authentication first.');
            return;
        }
        if (!formData.profilePicUrl) {
            toast.error('Please upload a profile photo first.');
            return;
        }
        try {
            setFaceVerificationLoading(true);
            const response = await authService.startFaceVerification(artistId);

            if (response.status === 'already_verified' || response.status === 'face_already_verified') {
                setFormData(prev => ({ ...prev, faceVerified: true }));
                toast.success('Face verification already completed!');
                return;
            }

            if (response.status === 'document_pending') {
                toast.error('Please complete KYC verification first.');
                return;
            }

            if (response.status === 'initiated' && response.face_url) {
                saveProgressBeforeRedirect();
                window.location.href = response.face_url;
            } else {
                toast.error('Failed to initiate face verification. Please try again.');
            }
        } catch (error: any) {
            console.error('Face verification error:', error);
            toast.error(error.message || 'Failed to start face verification.');
        } finally {
            setFaceVerificationLoading(false);
        }
    }, [artistId, formData.profilePicUrl, saveProgressBeforeRedirect]);

    const handleRetryKYC = useCallback(async () => {
        if (!artistId) {
            toast.error('Please complete authentication first.');
            return;
        }
        try {
            setKycLoading(true);
            const response = await authService.retryKYC(artistId);

            if (response.status === 'initiated' && response.kyc_url) {
                setFormData(prev => ({ ...prev, kycStatus: 'in_progress' }));
                saveProgressBeforeRedirect();
                window.location.href = response.kyc_url;
            } else {
                toast.error('Failed to retry KYC. Please try again.');
            }
        } catch (error: any) {
            console.error('KYC retry error:', error);
            toast.error(error.message || 'Failed to retry KYC verification.');
        } finally {
            setKycLoading(false);
        }
    }, [artistId, saveProgressBeforeRedirect]);

    // ─── Auto-check KYC on return from Meon ──────────────────────────
    // This runs on mount — if URL has ?kyc_return=true or ?face_return=true,
    // force navigate to sub-step 2 and check KYC status once artistId is available.
    const [pendingKycCheck, setPendingKycCheck] = useState(false);

    useEffect(() => {
        const kycReturn = searchParams.get('kyc_return');
        const faceReturn = searchParams.get('face_return');

        if (kycReturn === 'true' || faceReturn === 'true') {
            // Immediately navigate to KYC step regardless of artistId
            setFormStep('details-form');
            setSubStep(2);
            setPendingKycCheck(true);

            // Clean up query params
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('kyc_return');
            newParams.delete('face_return');
            setSearchParams(newParams, { replace: true });

            toast.info('Returned from verification. Checking status...');
        }
    }, []); // Run only on mount

    // Once artistId becomes available and we have a pending check, poll for status
    useEffect(() => {
        if (pendingKycCheck && artistId) {
            let attempts = 0;
            const maxAttempts = 6;
            const pollInterval = 3000; // 3 seconds between polls
            let cancelled = false;

            const poll = async () => {
                if (cancelled) return;
                attempts++;
                try {
                    setKycLoading(true);
                    const status = await authService.getKYCStatus(artistId);
                    setFormData(prev => ({
                        ...prev,
                        kycStatus: status.kyc_verified
                            ? 'verified' as const
                            : (status.kyc_status as FormData['kycStatus']) || prev.kycStatus,
                        faceVerified: status.face_verified,
                    }));

                    // Stop polling if resolved (not pending/in_progress)
                    if (status.kyc_status !== 'pending' && status.kyc_status !== 'in_progress') {
                        setKycLoading(false);
                        setPendingKycCheck(false);
                        if (status.kyc_verified) toast.success('KYC verified!');
                        else if (status.kyc_status === 'document_verified') toast.success('Document verified! Face verification pending.');
                        else if (status.kyc_status === 'failed') toast.error('KYC verification failed. Please retry.');
                        return;
                    }

                    if (attempts < maxAttempts && !cancelled) {
                        setTimeout(poll, pollInterval);
                    } else {
                        setKycLoading(false);
                        setPendingKycCheck(false);
                        toast.info('Verification is being processed. Click "Check Status" to see updates.');
                    }
                } catch (error) {
                    console.error('KYC poll error:', error);
                    setKycLoading(false);
                    setPendingKycCheck(false);
                }
            };

            // Initial delay before first poll (give webhook time to arrive)
            const timer = setTimeout(poll, 2000);
            return () => {
                cancelled = true;
                clearTimeout(timer);
            };
        }
    }, [pendingKycCheck, artistId]);

    // Auto-fill address from localStorage('userAddress') if available
    useEffect(() => {
        if (subStep === 4) {
            const cachedAddr = localStorage.getItem('userAddress');
            if (cachedAddr) {
                try {
                    const addr = JSON.parse(cachedAddr);
                    setFormData(prev => ({
                        ...prev,
                        address: {
                            flatNo: addr.flat_building || prev.address.flatNo || '',
                            street: addr.street_area || prev.address.street || '',
                            landmark: addr.landmark || prev.address.landmark || '',
                            pincode: addr.pincode || prev.address.pincode || '',
                            city: addr.city || prev.address.city || '',
                            state: addr.state || prev.address.state || '',
                            location: prev.address.location,
                        },
                    }));
                    setLocationCaptured(true);
                } catch { /* ignore */ }
            }
        }
    }, [subStep]);

    // Reverse geocode: auto-fill address fields when location is captured
    useEffect(() => {
        if (!geoLocation) return;

        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                location: { lat: geoLocation.latitude, lng: geoLocation.longitude },
            },
        }));

        const reverseGeocode = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const res = await fetch(
                    `${baseUrl}/geocode/reverse?lat=${geoLocation.latitude}&lon=${geoLocation.longitude}`
                );
                if (!res.ok) return;
                const data = await res.json();
                const addr = data.address || {};

                setFormData(prev => ({
                    ...prev,
                    address: {
                        flatNo: prev.address.flatNo || '',
                        street: addr.road || addr.neighbourhood || addr.suburb || prev.address.street || '',
                        landmark: addr.neighbourhood || addr.suburb || prev.address.landmark || '',
                        pincode: addr.postcode || prev.address.pincode || '',
                        city: addr.city || addr.town || addr.village || addr.county || prev.address.city || '',
                        state: addr.state || prev.address.state || '',
                        location: { lat: geoLocation.latitude, lng: geoLocation.longitude },
                    },
                }));
                setLocationCaptured(true);
                toast.success('Address auto-filled from your location!');
            } catch (err) {
                console.error('Reverse geocoding failed:', err);
                setLocationCaptured(true);
            }
        };

        reverseGeocode();
    }, [geoLocation]);

    // ─── Form Data Helpers ───────────────────────────────────────────
    const updateFormData = (updates: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
        Object.keys(updates).forEach(key => {
            setTouchedFields(prev => ({ ...prev, [key]: true }));
        });
    };

    // ─── Validation ──────────────────────────────────────────────────
    const validateEmail = (email: string): string => {
        if (!email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePhone = (phone: string): string => {
        if (!phone.trim()) return 'Phone number is required';
        const cleanPhone = phone.replace(/\s/g, '');
        if (!/^\d{10}$/.test(cleanPhone)) return 'Phone number must be 10 digits';
        return '';
    };

    const validateBirthday = (birthday: string): string => {
        if (!birthday.trim()) return 'Birthday is required';
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = birthday.match(dateRegex);
        if (!match) return 'Use format: DD/MM/YYYY';

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        if (month < 1 || month > 12) return 'Invalid month';
        if (day < 1 || day > 31) return 'Invalid day';

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const isUnder18 = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())));

        if (isUnder18) return 'You must be at least 18 years old';
        if (birthDate > today) return 'Birthday cannot be in the future';

        return '';
    };

    const validateFullName = (name: string): string => {
        if (!name.trim()) return 'Full name is required';
        if (name.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name should only contain letters';
        return '';
    };

    const validateGender = (gender: string): string => {
        if (!gender) return 'Please select your gender';
        return '';
    };

    const validateExperience = (experience: string): string => {
        if (!experience) return 'Please select your experience level';
        return '';
    };

    const validateBio = (bio: string): string => {
        if (!bio.trim()) return 'Bio is required';
        if (bio.length < 20) return 'Bio must be at least 20 characters';
        if (bio.length > 500) return 'Bio cannot exceed 500 characters';
        return '';
    };

    const getFieldError = (field: keyof FormData): string => {
        if (!touchedFields[field]) return '';
        switch (field) {
            case 'fullName': return validateFullName(formData.fullName);
            case 'email': return validateEmail(formData.email);
            case 'phone': return validatePhone(formData.phone);
            case 'birthday': return validateBirthday(formData.birthday);
            case 'gender': return validateGender(formData.gender);
            case 'experience': return validateExperience(formData.experience);
            case 'bio': return validateBio(formData.bio);
            default: return '';
        }
    };

    const isFormValid = (): boolean => {
        switch (subStep) {
            case 1: {
                const basicInfoValid =
                    !validateFullName(formData.fullName) &&
                    !validateEmail(formData.email) &&
                    !validatePhone(formData.phone) &&
                    !validateBirthday(formData.birthday) &&
                    !validateGender(formData.gender) &&
                    !validateExperience(formData.experience) &&
                    !validateBio(formData.bio);
                if (signupMethod === 'phone' && !phoneVerified) return false;
                if (signupMethod === 'email' && !emailVerified) return false;
                return basicInfoValid;
            }
            case 2:
                return true;
            case 3:
                if (!formData.howDidYouLearn) return false;
                if (formData.howDidYouLearn === 'professional' && !formData.certificateUrl) return false;
                return true;
            case 4:
                return formData.address.street.trim().length > 0 &&
                    formData.address.city.trim().length > 0 &&
                    formData.address.pincode.trim().length >= 5;
            default:
                return false;
        }
    };

    // ─── Skill Helpers ───────────────────────────────────────────────
    const getSkillSuggestions = (): string[] => {
        const suggestions: string[] = [];
        if (selectedProfessions.includes('makeup')) {
            suggestions.push('HD Makeup', 'Airbrush Makeup', 'Party Makeup', 'Matte Finish', 'Dewy Finish', 'No-Makeup Look', 'Glam Look', 'Smokey Eyes', 'Bridal Eye Makeup', 'Cut Crease');
        }
        if (selectedProfessions.includes('hairstylist')) {
            suggestions.push('Bridal Hairstyling', 'Hair Extensions', 'Blow Dry', 'Updos', 'Braids', 'Hair Coloring');
        }
        if (selectedProfessions.includes('nail')) {
            suggestions.push('Gel Nails', 'Acrylic Nails', 'Nail Art', 'Manicure', 'Pedicure', 'French Tips');
        }
        if (selectedProfessions.includes('mehendi')) {
            suggestions.push('Bridal Mehendi', 'Arabic Mehendi', 'Indo-Arabic', 'Rajasthani', 'Minimalist Mehendi');
        }
        if (selectedProfessions.includes('saree-draping')) {
            suggestions.push('Bengali Style', 'Gujarati Style', 'Maharashtrian Style', 'South Indian Style', 'Lehenga Draping');
        }
        if (selectedProfessions.includes('saree-pleating')) {
            suggestions.push('Pre-pleated Saree', 'Party Draping', 'Designer Draping', 'Seedha Pallu', 'Ulta Pallu');
        }
        return suggestions.filter(s => !skills.includes(s));
    };

    const toggleEventType = (eventType: string) => {
        setSelectedEventTypes(prev =>
            prev.includes(eventType) ? prev.filter(e => e !== eventType) : [...prev, eventType]
        );
    };

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills(prev => [...prev, trimmed]);
        }
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setSkills(prev => prev.filter(s => s !== skill));
    };

    const toggleTravelWillingness = (id: string) => {
        setTravelWillingness(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const updateStudioAddress = (field: string, value: string) => {
        setStudioAddress(prev => ({ ...prev, [field]: value }));
    };

    const toggleProfession = (professionId: string) => {
        setSelectedProfessions(prev =>
            prev.includes(professionId) ? prev.filter(id => id !== professionId) : [...prev, professionId]
        );
    };

    // ─── Working Hours ───────────────────────────────────────────────
    const addWorkingHour = (period: string, startTime: string, endTime: string) => {
        const exists = workingHours.some(wh => wh.period === period);
        if (!exists) {
            setWorkingHours(prev => [...prev, { period, startTime, endTime }]);
        }
    };

    const removeWorkingHour = (period: string) => {
        setWorkingHours(prev => prev.filter(wh => wh.period !== period));
    };

    const handleTimePickerDone = () => {
        if (timePeriodSelection === 'Any time') {
            addWorkingHour('Any time', '12am', '12am');
        } else if (timePeriodSelection === 'Custom' && customStartTime && customEndTime) {
            addWorkingHour('Custom', customStartTime, customEndTime);
        } else {
            const preset = TIME_PRESETS.find(tp => tp.label === timePeriodSelection);
            if (preset) {
                addWorkingHour(preset.label, preset.startTime, preset.endTime);
            }
        }
        setIsTimePickerOpen(false);
        setTimePeriodSelection('');
        setCustomStartTime('');
        setCustomEndTime('');
    };

    // ─── Step Navigation ─────────────────────────────────────────────
    const getActiveStep = (): number => {
        if (!setupSteps.step1) return 1;
        if (!setupSteps.step2) return 2;
        if (!setupSteps.step3) return 3;
        if (!setupSteps.step4) return 4;
        return 0;
    };

    const activeStep = getActiveStep();

    const handleStepContinue = (step: number) => {
        if (step === 2) setFormStep('booking-modes');
        else if (step === 3) setFormStep('portfolio');
        else if (step === 4) setFormStep('bank-details');
    };

    // ─── Auth Handlers ───────────────────────────────────────────────
    const handlePhoneSignup = () => {
        setSignupMethod('phone');
        setFormStep('details-form');
    };

    const handleEmailSignup = () => {
        setSignupMethod('email');
        setFormStep('details-form');
    };

    const handleGoogleSignup = async () => {
        setSignupMethod('google');
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            const result = await signInWithPopup(firebaseAuth, provider);
            const gUser = result.user;
            const token = await gUser.getIdToken();

            localStorage.setItem('firebaseToken', token);

            // Create/get artist record from backend immediately so artistId is available
            try {
                const artist = await authService.authenticateWithOAuth(token, 'artist', 'signup');
                updateUser(artist as any);
                localStorage.setItem('user', JSON.stringify(artist));
            } catch (backendErr: any) {
                // Don't block signup flow — will retry when reaching KYC step via fallback
                console.warn('Backend auth deferred during Google signup:', backendErr.message);
            }

            setFormData(prev => ({
                ...prev,
                fullName: gUser.displayName || prev.fullName,
                email: gUser.email || prev.email,
                profilePicUrl: gUser.photoURL || prev.profilePicUrl,
            }));

            setEmailVerified(true);
            setFormStep('details-form');
            toast.success('Google account connected! Please complete your profile.');
        } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in cancelled');
            } else if (err.code === 'auth/popup-blocked') {
                toast.error('Popup blocked. Please allow popups for this site.');
            } else {
                toast.error(err.message || 'Failed to sign in with Google');
            }
        }
    };

    // ─── File Upload ─────────────────────────────────────────────────
    const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        setOtpError('');

        try {
            const url = await uploadProfilePicture(file, {
                onProgress: (progress) => console.log(`Upload: ${Math.round(progress)}%`),
                onError: (error) => {
                    setOtpError(error);
                    toast.error(error);
                },
                onSuccess: () => toast.success('Profile picture uploaded!')
            });

            setFormData(prev => ({ ...prev, profilePicUrl: url }));
        } catch (error: any) {
            const friendlyError = getErrorMessage(error);
            setOtpError(friendlyError);
            toast.error(friendlyError);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveProfilePic = () => {
        updateFormData({ profilePicUrl: '' });
        if (profilePicInputRef.current) {
            profilePicInputRef.current.value = '';
        }
    };

    // ─── OTP Handlers ────────────────────────────────────────────────
    const handleSendPhoneOTP = async () => {
        setOtpSending(true);
        setOtpError('');
        setOtpSuccess('');
        try {
            const fullPhone = `${formData.countryCode}${formData.phone}`;
            const { exists, user_type: existingType } = await authService.checkUserExists(fullPhone, 'phone', 'artist');

            if (exists && existingType === 'artist') {
                throw new Error('Account already exists. Please login instead.');
            }
            if (exists && existingType === 'customer') {
                toast.info('We found your customer account! Proceeding to create your artist profile.');
            }

            await sendPhoneOTP(fullPhone);
            setOtpSent(true);
            setOtpSuccess('OTP sent to your phone!');
            setTimeout(() => setOtpSuccess(''), 3000);
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
        } finally {
            setOtpSending(false);
        }
    };

    const handleVerifyPhoneOTP = async () => {
        setOtpError('');
        setOtpSuccess('');
        try {
            if (!formData.otp || formData.otp.length < 6) {
                throw new Error('Please enter a valid 6-digit OTP');
            }
            await verifyPhoneOTP(formData.otp, formData.fullName);
            setPhoneVerified(true);
            setOtpSent(false);
            updateFormData({ otp: '' });
            setOtpSuccess('Phone verified successfully!');
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
            updateFormData({ otp: '' });
        }
    };

    const handleSendEmailOTP = async () => {
        setOtpSending(true);
        setOtpError('');
        setOtpSuccess('');
        try {
            const { exists, user_type: existingType } = await authService.checkUserExists(formData.email, 'email', 'artist');

            if (exists && existingType === 'artist') {
                throw new Error('Account already exists. Please login instead.');
            }
            if (exists && existingType === 'customer') {
                toast.info('We found your customer account! Proceeding to create your artist profile.');
            }

            await sendEmailOTP(formData.email, formData.fullName || 'User');
            setOtpSent(true);
            setOtpSuccess('OTP sent to your email!');
            setTimeout(() => setOtpSuccess(''), 3000);
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
        } finally {
            setOtpSending(false);
        }
    };

    const handleVerifyEmailOTP = async () => {
        setOtpError('');
        setOtpSuccess('');
        try {
            const verifiedUser = await authService.verifyEmailOTP(
                { email: formData.email, otp: formData.otp },
                'artist'
            );

            if (verifiedUser.token) {
                localStorage.setItem('firebaseToken', verifiedUser.token);
            }

            // Store user in AuthContext so artistId gets extracted
            updateUser(verifiedUser as any);
            localStorage.setItem('user', JSON.stringify(verifiedUser));

            setEmailVerified(true);
            setOtpSent(false);
            updateFormData({ otp: '' });
            setOtpSuccess('Email verified successfully!');
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
            updateFormData({ otp: '' });
        }
    };

    // ─── Navigation Handlers ─────────────────────────────────────────
    const handleBack = () => {
        if (subStep > 1) {
            setSubStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (formStep === 'details-form' || formStep === 'otp-verify') {
            setFormStep('method-select');
            setSignupMethod(null);
            setOtpSent(false);
        } else {
            navigate('/auth/artist/login');
        }
    };

    const handleSaveAndContinue = async () => {
        setIsSaving(true);
        try {
            if (subStep < 4) {
                const progress = {
                    formData,
                    subStep: subStep + 1,
                    formStep,
                    signupMethod,
                    phoneVerified,
                    emailVerified
                };
                localStorage.setItem('artist_signup_data', JSON.stringify(progress));
                setSubStep(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const profileData = {
                    name: formData.fullName,
                    phone_number: `${formData.countryCode}${formData.phone.replace(/\s/g, '')}`,
                    birthdate: formData.birthday,
                    gender: formData.gender,
                    experience: formData.experience,
                    bio: formData.bio,
                    profile_pic_url: formData.profilePicUrl,
                    how_did_you_learn: formData.howDidYouLearn,
                    certificate_url: formData.certificateUrl,
                    flat_building: formData.address.flatNo,
                    street_area: formData.address.street,
                    landmark: formData.address.landmark,
                    pincode: formData.address.pincode,
                    city: formData.address.city,
                    state: formData.address.state,
                    latitude: formData.address.location?.lat,
                    longitude: formData.address.location?.lng,
                };

                if (signupMethod === 'google') {
                    const firebaseToken = localStorage.getItem('firebaseToken');
                    if (!firebaseToken) {
                        throw new Error('Session expired. Please sign up again.');
                    }
                    await authService.authenticateWithOAuth(firebaseToken, 'artist', 'signup');
                }

                const updatedArtist = await authService.completeArtistProfile({
                    ...profileData,
                    mark_complete: false,
                });

                localStorage.setItem('user', JSON.stringify(updatedArtist));

                setSetupSteps(prev => {
                    const next = { ...prev, step1: true };
                    localStorage.setItem('artist_setup_steps', JSON.stringify(next));
                    return next;
                });

                localStorage.removeItem('artist_signup_data');

                toast.success('Personal details saved!');
                setShowSuccess(true);
            }
        } catch (error: any) {
            console.error('Error saving progress:', error);
            toast.error(error.message || 'Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = () => {
        setFormData({ ...INITIAL_FORM_DATA });
        setPhoneVerified(false);
        setEmailVerified(false);
        localStorage.removeItem('artist_signup_data');
    };

    // ─── Booking Mode Handlers ───────────────────────────────────────
    const handleBookingModeNext = () => {
        if (bookingModeSubStep === 1) {
            if (!bookingMode) { toast.error('Please select a booking mode'); return; }
            setBookingModeSubStep(2);
        } else if (bookingModeSubStep === 2) {
            if (selectedProfessions.length === 0) { toast.error('Please select at least one specialization'); return; }
            setBookingModeSubStep(3);
        } else if (bookingModeSubStep === 3) {
            if (selectedEventTypes.length === 0) { toast.error('Please select at least one event type'); return; }
            if (skills.length === 0) { toast.error('Please add at least one skill'); return; }
            setBookingModeSubStep(4);
        } else if (bookingModeSubStep === 4) {
            if (!serviceLocation) { toast.error('Please select where you provide services'); return; }
            setBookingModeSubStep(5);
        } else if (bookingModeSubStep === 5) {
            if (serviceLocation === 'client' || serviceLocation === 'both') {
                if (travelWillingness.length === 0) { toast.error('Please select your travel willingness'); return; }
            }
            if (serviceLocation === 'studio' || serviceLocation === 'both') {
                if (!studioAddress.area || !studioAddress.pincode || !studioAddress.city || !studioAddress.state) {
                    toast.error('Please fill in the required studio address fields'); return;
                }
            }
            handleBookingModeSave();
        }
    };

    const handleBookingModeSave = async () => {
        try {
            const bookingData: Parameters<typeof authService.completeArtistProfile>[0] = {
                booking_mode: bookingMode,
                profession: selectedProfessions,
                skills: skills,
                event_types: selectedEventTypes,
                service_location: serviceLocation,
                travel_willingness: travelWillingness,
                studio_address: (serviceLocation === 'studio' || serviceLocation === 'both')
                    ? JSON.stringify(studioAddress) : undefined,
                working_hours: workingHours.length > 0
                    ? JSON.stringify(workingHours) : undefined,
                mark_complete: false,
            };

            const updatedArtist = await authService.completeArtistProfile(bookingData);
            localStorage.setItem('user', JSON.stringify(updatedArtist));

            localStorage.setItem('artist_booking_mode', bookingMode);
            localStorage.setItem('artist_professions', JSON.stringify(selectedProfessions));
            localStorage.setItem('artist_event_types', JSON.stringify(selectedEventTypes));
            localStorage.setItem('artist_skills', JSON.stringify(skills));
            localStorage.setItem('artist_service_location', serviceLocation);
            localStorage.setItem('artist_travel_willingness', JSON.stringify(travelWillingness));
            localStorage.setItem('artist_studio_address', JSON.stringify(studioAddress));
            localStorage.setItem('artist_working_hours', JSON.stringify(workingHours));

            setSetupSteps(prev => {
                const next = { ...prev, step2: true };
                localStorage.setItem('artist_setup_steps', JSON.stringify(next));
                return next;
            });

            toast.success('Booking mode saved!');
            setShowSuccess(true);
        } catch (error: any) {
            console.error('Error saving booking mode:', error);
            toast.error(error.message || 'Failed to save booking mode. Please try again.');
        }
    };

    const handleBookingModeBack = () => {
        if (bookingModeSubStep === 5) setBookingModeSubStep(4);
        else if (bookingModeSubStep === 4) setBookingModeSubStep(3);
        else if (bookingModeSubStep === 3) setBookingModeSubStep(2);
        else if (bookingModeSubStep === 2) setBookingModeSubStep(1);
        else setFormStep('method-select');
    };

    // ─── Portfolio Handlers ──────────────────────────────────────────
    const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remaining = 10 - portfolioImages.length;
        if (remaining <= 0) { toast.error('Maximum 10 photos allowed'); return; }

        const filesToUpload = Array.from(files).slice(0, remaining);
        setIsUploadingPortfolio(true);

        try {
            const uploadPromises = filesToUpload.map(file => uploadPortfolioImage(file));
            const urls = await Promise.all(uploadPromises);
            setPortfolioImages(prev => [...prev, ...urls]);
            toast.success(`${urls.length} photo${urls.length > 1 ? 's' : ''} uploaded!`);
        } catch (error: any) {
            console.error('Portfolio upload error:', error);
            toast.error('Failed to upload some photos. Please try again.');
        } finally {
            setIsUploadingPortfolio(false);
            if (portfolioInputRef.current) {
                portfolioInputRef.current.value = '';
            }
        }
    };

    const handlePortfolioDelete = (index: number) => {
        setPortfolioImages(prev => prev.filter((_, i) => i !== index));
    };

    const handlePortfolioDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handlePortfolioDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        setPortfolioImages(prev => {
            const newImages = [...prev];
            const draggedImage = newImages[draggedIndex];
            newImages.splice(draggedIndex, 1);
            newImages.splice(index, 0, draggedImage);
            return newImages;
        });
        setDraggedIndex(index);
    };

    const handlePortfolioDragEnd = () => {
        setDraggedIndex(null);
    };

    const handlePortfolioSave = async () => {
        if (portfolioImages.length === 0) { toast.error('Please upload at least one photo'); return; }

        try {
            const updatedArtist = await authService.completeArtistProfile({
                portfolio: portfolioImages,
                mark_complete: false,
            });
            localStorage.setItem('user', JSON.stringify(updatedArtist));

            setSetupSteps(prev => {
                const next = { ...prev, step3: true };
                localStorage.setItem('artist_setup_steps', JSON.stringify(next));
                return next;
            });

            toast.success('Portfolio saved!');
            setShowSuccess(true);
        } catch (error: any) {
            console.error('Error saving portfolio:', error);
            toast.error(error.message || 'Failed to save portfolio. Please try again.');
        }
    };

    // ─── Bank Details Handlers ───────────────────────────────────────
    const handleBankFieldChange = (field: keyof BankDetailsData, value: string) => {
        setBankDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleBankClear = () => {
        setBankDetails({ ...INITIAL_BANK_DETAILS });
    };

    const bankAccountMatch = bankDetails.accountNumber.length > 0 &&
        bankDetails.confirmAccountNumber.length > 0 &&
        bankDetails.accountNumber === bankDetails.confirmAccountNumber;

    const upiValid = bankDetails.upiId.length > 0 && /^[\w.-]+@[\w]+$/.test(bankDetails.upiId);

    const bankFilledCount = [
        bankDetails.accountHolderName,
        bankDetails.accountNumber,
        bankDetails.confirmAccountNumber,
        bankDetails.bankName,
        bankDetails.ifscCode,
    ].filter(v => v.length > 0).length;

    const bankProgress = bankFilledCount / 5;

    const canSubmitBank = bankDetails.accountHolderName.length > 0 &&
        bankAccountMatch &&
        bankDetails.bankName.length > 0 &&
        bankDetails.ifscCode.length > 0;

    const handleBankSave = async () => {
        if (!canSubmitBank && !upiValid) {
            toast.error('Please fill in all required fields or provide a valid UPI ID');
            return;
        }

        try {
            const updatedArtist = await authService.completeArtistProfile({
                bank_account_name: bankDetails.accountHolderName || undefined,
                bank_account_number: bankDetails.accountNumber || undefined,
                bank_name: bankDetails.bankName || undefined,
                bank_ifsc: bankDetails.ifscCode || undefined,
                upi_id: bankDetails.upiId || undefined,
                mark_complete: true,
            });
            updateUser(updatedArtist);

            setSetupSteps(prev => {
                const next = { ...prev, step4: true };
                localStorage.setItem('artist_setup_steps', JSON.stringify(next));
                return next;
            });

            toast.success('Profile completed!');
            setShowSuccess(true);

            setTimeout(() => {
                navigate('/artist/home');
            }, 2000);
        } catch (error: any) {
            console.error('Error saving bank details:', error);
            toast.error(error.message || 'Failed to save bank details. Please try again.');
        }
    };

    // ─── Context Value ───────────────────────────────────────────────
    const value: ArtistSignupContextValue = {
        navigate,
        isLoading,
        error,
        signupMethod, setSignupMethod,
        formStep, setFormStep,
        subStep, setSubStep,
        setupSteps, setSetupSteps,
        activeStep,
        formData, setFormData,
        updateFormData,
        touchedFields, getFieldError, isFormValid,
        isSaving, showSuccess, setShowSuccess,
        phoneVerified, emailVerified,
        otpSent, otpSending, otpError, otpSuccess,
        isUploadingImage, profilePicInputRef,
        geoLocation, geoLoading, geoError, requestLocation, locationCaptured,
        bookingMode, setBookingMode,
        bookingModeSubStep, setBookingModeSubStep,
        selectedProfessions, toggleProfession,
        selectedEventTypes, toggleEventType,
        isEventDropdownOpen, setIsEventDropdownOpen,
        skills, skillInput, setSkillInput,
        isSkillsModalOpen, setIsSkillsModalOpen,
        addSkill, removeSkill, getSkillSuggestions,
        eventDropdownRef,
        serviceLocation, setServiceLocation,
        travelWillingness, toggleTravelWillingness,
        studioAddress, updateStudioAddress,
        workingHours,
        isTimePickerOpen, setIsTimePickerOpen,
        timePeriodSelection, setTimePeriodSelection,
        customStartTime, setCustomStartTime,
        customEndTime, setCustomEndTime,
        addWorkingHour, removeWorkingHour, handleTimePickerDone,
        portfolioImages, isUploadingPortfolio,
        draggedIndex, portfolioInputRef,
        handlePortfolioUpload, handlePortfolioDelete,
        handlePortfolioDragStart, handlePortfolioDragOver, handlePortfolioDragEnd,
        handlePortfolioSave,
        bankDetails, handleBankFieldChange, handleBankClear, handleBankSave,
        bankAccountMatch, upiValid, bankFilledCount, bankProgress, canSubmitBank,
        kycLoading, faceVerificationLoading, artistId,
        handleStartKYC, handleStartFaceVerification, handleCheckKYCStatus, handleRetryKYC,
        handlePhoneSignup, handleEmailSignup, handleGoogleSignup,
        handleProfilePicUpload, handleRemoveProfilePic,
        handleSendPhoneOTP, handleVerifyPhoneOTP,
        handleSendEmailOTP, handleVerifyEmailOTP,
        handleBack, handleSaveAndContinue, handleClear,
        handleStepContinue,
        handleBookingModeNext, handleBookingModeSave, handleBookingModeBack,
        scrollContainerRef, contentRef,
    };

    return (
        <ArtistSignupContext.Provider value={value}>
            {children}
        </ArtistSignupContext.Provider>
    );
};
