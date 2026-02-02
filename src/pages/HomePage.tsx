import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-br from-pink-50 to-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* MIMORA Logo */}
                <div className="mb-8">
                    <span className="text-2xl font-bold tracking-wider" style={{ color: '#E84A7F' }}>
                        MIMORA
                    </span>
                </div>

                {/* Welcome Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    {/* Success Icon */}
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
                        Welcome to Mimora!
                    </h1>
                    <p className="text-gray-500 mb-6">
                        You have successfully logged in. This is a placeholder home page.
                    </p>

                    {/* User Info Placeholder */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                U
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-[#1E1E1E]">User</p>
                                <p className="text-sm text-gray-500">Customer Account</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full h-12 bg-[#1E1E1E] text-white rounded-full font-medium hover:bg-[#2a2a2a] transition-colors"
                        >
                            Explore Services
                        </button>
                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full h-12 bg-white text-[#1E1E1E] border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors"
                        >
                            Back to Auth
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-gray-400">
                    This is a placeholder page. The actual home page will be built later.
                </p>
            </div>
        </div>
    );
};

export default HomePage;
