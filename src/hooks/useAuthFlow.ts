import { useState, useCallback, useEffect, useRef } from 'react';

export type AuthStep =
    | 'profile-selection'
    | 'create-account'
    | 'signup-customer'
    | 'signup-customer-email'
    | 'login-email'
    | 'login-phone'
    | 'otp-verification'
    | 'success';

export type ProfileType = 'customer' | 'artist' | null;
export type AuthMethod = 'email' | 'phone' | null;

interface AuthFormData {
    fullName: string;
    email: string;
    phone: string;
    countryCode: string;
    otp: string[];
}

interface AuthFlowState {
    step: AuthStep;
    profileType: ProfileType;
    authMethod: AuthMethod;
    formData: AuthFormData;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

const initialFormData: AuthFormData = {
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    otp: ['', '', '', '', '', ''],
};

const initialState: AuthFlowState = {
    step: 'profile-selection',
    profileType: null,
    authMethod: null,
    formData: initialFormData,
    isEmailVerified: false,
    isPhoneVerified: false,
};

export function useAuthFlow() {
    const [state, setState] = useState<AuthFlowState>(initialState);
    const isNavigatingBack = useRef(false);

    // Push initial state to history on mount
    useEffect(() => {
        // Replace current history state with initial auth step
        window.history.replaceState({ step: 'profile-selection' }, '', '/auth');
    }, []);

    // Listen for browser back/forward button
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state?.step) {
                isNavigatingBack.current = true;
                setState(prev => ({ ...prev, step: event.state.step }));
                // Reset the flag after state update
                setTimeout(() => {
                    isNavigatingBack.current = false;
                }, 0);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const setStep = useCallback((step: AuthStep) => {
        // Only push to history if not navigating via back button
        if (!isNavigatingBack.current) {
            window.history.pushState({ step }, '', '/auth');
        }
        setState(prev => ({ ...prev, step }));
    }, []);

    const setProfileType = useCallback((profileType: ProfileType) => {
        setState(prev => ({ ...prev, profileType }));
    }, []);

    const setAuthMethod = useCallback((authMethod: AuthMethod) => {
        setState(prev => ({ ...prev, authMethod }));
    }, []);

    const updateFormData = useCallback((updates: Partial<AuthFormData>) => {
        setState(prev => ({
            ...prev,
            formData: { ...prev.formData, ...updates },
        }));
    }, []);

    const setEmailVerified = useCallback((verified: boolean) => {
        setState(prev => ({ ...prev, isEmailVerified: verified }));
    }, []);

    const setPhoneVerified = useCallback((verified: boolean) => {
        setState(prev => ({ ...prev, isPhoneVerified: verified }));
    }, []);

    const goToCreateAccount = useCallback(() => {
        setStep('create-account');
    }, [setStep]);

    const goToLogin = useCallback((method: AuthMethod = 'email') => {
        setAuthMethod(method);
        setStep(method === 'email' ? 'login-email' : 'login-phone');
    }, [setStep, setAuthMethod]);

    const goToOTP = useCallback(() => {
        setStep('otp-verification');
    }, [setStep]);

    const goToCustomerSignup = useCallback(() => {
        setStep('signup-customer');
    }, [setStep]);

    const goToCustomerEmailSignup = useCallback(() => {
        setStep('signup-customer-email');
    }, [setStep]);

    const goToSuccess = useCallback(() => {
        setStep('success');
    }, [setStep]);

    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    return {
        ...state,
        setStep,
        setProfileType,
        setAuthMethod,
        updateFormData,
        setEmailVerified,
        setPhoneVerified,
        goToCreateAccount,
        goToCustomerSignup,
        goToCustomerEmailSignup,
        goToLogin,
        goToOTP,
        goToSuccess,
        reset,
    };
}

export type UseAuthFlow = ReturnType<typeof useAuthFlow>;
