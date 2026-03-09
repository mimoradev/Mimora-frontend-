// Types
export type SignupMethod = 'phone' | 'email' | 'google' | null;
export type FormStep = 'method-select' | 'otp-verify' | 'details-form' | 'booking-modes' | 'portfolio' | 'bank-details';

export interface FormData {
    fullName: string;
    email: string;
    countryCode: string;
    phone: string;
    birthday: string;
    gender: string;
    experience: string;
    bio: string;
    otp: string;
    // Step 2: Identity Verification
    kycStatus: 'not_started' | 'pending' | 'in_progress' | 'document_verified' | 'verified' | 'failed';
    profilePicUrl: string;
    faceVerified: boolean;
    // Step 3: Professional Info
    howDidYouLearn: 'professional' | 'self-learned' | 'apprentice' | '';
    certificateUrl: string;
    // Step 4: Address Details
    address: {
        flatNo: string;
        street: string;
        landmark: string;
        pincode: string;
        city: string;
        state: string;
        location?: { lat: number; lng: number };
    };
}

export interface StudioAddress {
    shopNo: string;
    area: string;
    landmark: string;
    pincode: string;
    city: string;
    state: string;
}

export interface BankDetailsData {
    accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    bankName: string;
    ifscCode: string;
    upiId: string;
}

export interface WorkingHour {
    period: string;
    startTime: string;
    endTime: string;
}

export interface SetupSteps {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
}

// Constants
export const INITIAL_FORM_DATA: FormData = {
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    birthday: '',
    gender: '',
    experience: '',
    bio: '',
    otp: '',
    kycStatus: 'not_started',
    profilePicUrl: '',
    faceVerified: false,
    howDidYouLearn: '',
    certificateUrl: '',
    address: {
        flatNo: '',
        street: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
    },
};

export const INITIAL_BANK_DETAILS: BankDetailsData = {
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    ifscCode: '',
    upiId: '',
};

export const INITIAL_STUDIO_ADDRESS: StudioAddress = {
    shopNo: '',
    area: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
};

export const INITIAL_SETUP_STEPS: SetupSteps = {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
};

export const EVENT_TYPE_OPTIONS = [
    'Wedding', 'Engagement', 'Shoot', 'Parties', 'Baby shower',
    'Haldi/Sangeet', 'Corporate events', 'Fashion shows', 'Others'
];

export const PROFESSIONS = [
    { id: 'makeup', label: 'Makeup Artist', image: '/info/home/catagory section/mackup.png' },
    { id: 'hairstylist', label: 'Hairstylist', image: '/info/home/catagory section/hairstylist.png' },
    { id: 'nail', label: 'Nail Artist', image: '/info/home/catagory section/nail.png' },
    { id: 'saree-draping', label: 'Saree Draping', image: '/info/home/catagory section/saree daping.png' },
    { id: 'mehendi', label: 'Mehendi Artist', image: '/info/home/catagory section/mahendi.png' },
    { id: 'saree-pleating', label: 'Saree Pleating', image: '/info/home/catagory section/saree plating.png' },
];

export const SERVICE_LOCATION_OPTIONS = [
    { id: 'client' as const, label: "Client's Location", subtitle: 'I travel to the client', image: "/info/signup/client's.png" },
    { id: 'studio' as const, label: 'My Studio', subtitle: 'Client comes to me', image: '/info/signup/studio.png' },
    { id: 'both' as const, label: 'Both', subtitle: '', image: '/info/signup/boths.png' },
];

export const TRAVEL_WILLINGNESS_OPTIONS = [
    { id: 'within-city', label: 'Within my city', image: '/info/signup/city/within my city.png' },
    { id: 'within-region', label: 'Within my region', image: '/info/signup/city/with my region.png' },
    { id: 'nationwide', label: 'Nationwide', image: '/info/signup/city/nationwide.png' },
];

export const TIME_PRESETS: { label: string; startTime: string; endTime: string }[] = [
    { label: 'Morning', startTime: '9am', endTime: '12pm' },
    { label: 'Afternoon', startTime: '1pm', endTime: '3pm' },
    { label: 'Evening', startTime: '5pm', endTime: '9pm' },
];

export const TIME_OPTIONS = [
    '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
    '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
];

// KYC API Response Types
export interface KYCStartResponse {
    status: 'initiated' | 'already_verified' | 'in_progress';
    kyc_url?: string;
    kyc_id?: string;
    message: string;
    kyc_verified?: boolean;
}

export interface FaceStartResponse {
    status: 'initiated' | 'already_verified' | 'face_already_verified' | 'document_pending';
    face_url?: string;
    kyc_id?: string;
    message: string;
    kyc_verified?: boolean;
    current_step?: string;
}

export interface KYCStatusResponse {
    artist_id: string;
    username: string;
    kyc_verified: boolean;
    bank_verified: boolean;
    kyc_status: 'not_started' | 'pending' | 'in_progress' | 'document_verified' | 'verified' | 'failed' | 'cancelled';
    kyc_id: string | null;
    document_verified: boolean;
    face_verified: boolean;
    current_step: 'document' | 'face' | 'complete';
    verification_details?: Record<string, any>;
    last_updated?: string;
}
