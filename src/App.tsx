import { useEffect, lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Lenis from 'lenis'

// Providers
import { AuthProvider } from './contexts/AuthContext'

// Components
import PageLoader from './components/common/PageLoader'
import { RevealLoader } from './components/common/RevealLoader'
import { Toaster } from './components/common/Toaster'

// Pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const HomePage = lazy(() => import('./pages/HomePage'))

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Timer for the splash screen display duration
    const splashTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Show splash for 3.5 seconds before reveal

    return () => {
      lenis.destroy()
      clearTimeout(splashTimer);
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          {/* Main App Content - always rendered underneath */}
          <div className="min-h-screen bg-white">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Auth Routes - handled by AuthPage which reads the URL */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/customer" element={<Navigate to="/auth/customer/login" replace />} />
                <Route path="/auth/customer/login" element={<AuthPage />} />
                <Route path="/auth/customer/signup" element={<AuthPage />} />
                <Route path="/auth/artist" element={<Navigate to="/auth/artist/login" replace />} />
                <Route path="/auth/artist/login" element={<AuthPage />} />
                <Route path="/auth/artist/signup" element={<AuthPage />} />

                <Route path="/home" element={<HomePage />} />
              </Routes>
            </Suspense>
          </div>

          {/* Reveal Loader Overlay - shrinks away to reveal content */}
          <RevealLoader isLoading={isLoading} />

          {/* Toast Notifications */}
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
