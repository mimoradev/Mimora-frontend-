import React from 'react';
import CustomerHomeNavbar from '../components/home/CustomerHomeNavbar';
import HeroCarousel from '../components/home/HeroCarousel';
import SearchOverlay from '../components/home/SearchOverlay';
import CategoriesSection from '../components/home/CategoriesSection';
import ArtistSection from '../components/home/ArtistSection';
import CustomerHomeFooter from '../components/home/CustomerHomeFooter';
import type { ArtistData } from '../components/home/ArtistCard';

// Sample data for Frequently Booked artists
const frequentlyBookedArtists: ArtistData[] = [
    {
        id: '1',
        name: 'Kavya Ramesh',
        avatarColor: '#FFB6C1',
        specialty: 'Hairstylist',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'self-learned', label: 'Self Learned' },
        ],
        distance: '4.5 km away',
        experience: '5+ years',
        rating: '4,410.8K',
        portfolioColors: ['#D4A574', '#8B7355', '#C9A86C', '#A0826D'],
    },
    {
        id: '2',
        name: 'Shruti',
        avatarColor: '#DDA0DD',
        specialty: 'Makeup Artist',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'certified', label: 'Certified' },
        ],
        distance: '2.1 km away',
        experience: '3+ years',
        rating: '4,712.3K',
        portfolioColors: ['#B8860B', '#CD853F', '#DEB887', '#D2691E'],
    },
    {
        id: '3',
        name: 'Nisha Prabhu',
        avatarColor: '#F0E68C',
        specialty: 'Saree Draping · Saree Pleating',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'apprenticeship', label: 'Apprenticeship' },
        ],
        distance: '1.9 km away',
        experience: '1+ years',
        rating: '4,213.5K',
        portfolioColors: ['#FFB6C1', '#DDA0DD', '#F0E68C', '#FFA07A'],
    },
    {
        id: '4',
        name: 'Aarti',
        avatarColor: '#98FB98',
        specialty: 'Mehendi Artist',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'certified', label: 'Certified' },
        ],
        distance: '3.8 km away',
        experience: '10+ years',
        rating: '4,890.2K',
        portfolioColors: ['#98FB98', '#87CEEB', '#FFB6C1', '#DDA0DD'],
    },
];

// Sample data for Recently Booked artists
const recentlyBookedArtists: ArtistData[] = [
    {
        id: '5',
        name: 'Kavya Ramesh',
        avatarColor: '#FFB6C1',
        specialty: 'Hairstylist',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'self-learned', label: 'Self Learned' },
        ],
        distance: '4.5 km away',
        experience: '5+ years',
        rating: '4,410.8K',
        portfolioColors: ['#D4A574', '#8B7355', '#C9A86C', '#A0826D'],
    },
    {
        id: '6',
        name: 'Shruti',
        avatarColor: '#DDA0DD',
        specialty: 'Makeup Artist',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'certified', label: 'Certified' },
        ],
        distance: '2.1 km away',
        experience: '3+ years',
        rating: '4,712.3K',
        portfolioColors: ['#B8860B', '#CD853F', '#DEB887', '#D2691E'],
    },
    {
        id: '7',
        name: 'Nisha Prabhu',
        avatarColor: '#F0E68C',
        specialty: 'Saree Draping · Saree Pleating',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'apprenticeship', label: 'Apprenticeship' },
        ],
        distance: '1.9 km away',
        experience: '1+ years',
        rating: '4,213.5K',
        portfolioColors: ['#FFB6C1', '#DDA0DD', '#F0E68C', '#FFA07A'],
    },
    {
        id: '8',
        name: 'Aarti',
        avatarColor: '#98FB98',
        specialty: 'Mehendi Artist',
        badges: [
            { type: 'kyc', label: 'KYC' },
            { type: 'certified', label: 'Certified' },
        ],
        distance: '3.8 km away',
        experience: '10+ years',
        rating: '4,890.2K',
        portfolioColors: ['#98FB98', '#87CEEB', '#FFB6C1', '#DDA0DD'],
    },
];

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Customer Home Navbar */}
            <CustomerHomeNavbar />

            {/* Main Content */}
            <main>
                {/* Hero Section with Carousel */}
                <section className="bg-[#FFE9F0] pt-6 pb-32">
                    <HeroCarousel />
                </section>

                {/* Search Overlay - Positioned over hero bottom */}
                <SearchOverlay />

                {/* Categories Section */}
                <CategoriesSection />

                {/* Frequently Booked Section */}
                <ArtistSection
                    title="Frequently Booked"
                    artists={frequentlyBookedArtists}
                    buttonText="View Package"
                />

                {/* Recently Booked Section */}
                <ArtistSection
                    title="Recently Booked"
                    artists={recentlyBookedArtists}
                    buttonText="Book Again"
                />
            </main>

            {/* Footer */}
            <CustomerHomeFooter />
        </div>
    );
};

export default HomePage;
