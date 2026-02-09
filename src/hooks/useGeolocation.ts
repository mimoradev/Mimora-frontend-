import { useState, useCallback, useEffect } from 'react';

interface Location {
    latitude: number;
    longitude: number;
}

interface GeolocationState {
    location: Location | null;
    error: string | null;
    loading: boolean;
}

/**
 * Hook to get user's geolocation
 * Automatically requests location on mount and caches in localStorage
 */
export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
        loading: false,
    });

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setState({ location: loc, error: null, loading: false });
                // Cache in localStorage for later use
                localStorage.setItem('userLocation', JSON.stringify(loc));
            },
            (err) => {
                setState(prev => ({
                    ...prev,
                    error: err.message,
                    loading: false,
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000, // 10 minutes
            }
        );
    }, []);

    // Auto-request on mount, or load from cache
    useEffect(() => {
        const stored = localStorage.getItem('userLocation');
        if (stored) {
            try {
                const loc = JSON.parse(stored) as Location;
                setState({ location: loc, error: null, loading: false });
            } catch {
                // Invalid data in storage, request fresh
                requestLocation();
            }
        } else {
            requestLocation();
        }
    }, [requestLocation]);

    return {
        ...state,
        requestLocation,
    };
}

/**
 * Get cached location from localStorage (synchronous)
 * Useful for getting location when sending auth requests
 */
export function getCachedLocation(): Location | null {
    const stored = localStorage.getItem('userLocation');
    if (!stored) return null;
    try {
        return JSON.parse(stored) as Location;
    } catch {
        return null;
    }
}
