import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing_page/HeroSection';
import FeaturesSection from '../components/landing_page/FeaturesSection';

import AppDownloadSection from '../components/landing_page/AppDownloadSection';

import Footer from '../components/landing_page/Footer';

function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <AppDownloadSection />
            <Footer />
        </div>
    );
}

export default LandingPage;
