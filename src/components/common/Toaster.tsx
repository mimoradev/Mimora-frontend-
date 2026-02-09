import { Toaster as SonnerToaster } from 'sonner';

/**
 * Custom Toaster component styled to match Mimora's dark theme
 */
export function Toaster() {
    return (
        <SonnerToaster
            position="top-center"
            expand={false}
            richColors
            toastOptions={{
                style: {
                    background: '#1E1E1E',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                },
                className: 'mimora-toast',
            }}
        />
    );
}
