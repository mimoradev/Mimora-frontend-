import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function PrivacyPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-[#666] hover:text-[#1E1E1E] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[900px] mx-auto px-6 md:px-10 py-12 md:py-16">
                <h1 className="text-[36px] md:text-[44px] font-bold text-[#1E1E1E] mb-4">Privacy Policy</h1>
                <p className="text-[#666] text-sm mb-12">Last updated: February 12, 2026</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Introduction</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            Welcome to Mimora. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you about how we look after your personal data when you visit
                            our website and tell you about your privacy rights.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Information We Collect</h2>
                        <p className="text-[#666] leading-relaxed mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
                        <ul className="list-disc pl-6 text-[#666] space-y-2">
                            <li>Identity Data: name, username or similar identifier</li>
                            <li>Contact Data: email address, phone number</li>
                            <li>Technical Data: IP address, browser type, device information</li>
                            <li>Usage Data: information about how you use our website and services</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">How We Use Your Information</h2>
                        <p className="text-[#666] leading-relaxed mb-4">We use your personal data for the following purposes:</p>
                        <ul className="list-disc pl-6 text-[#666] space-y-2">
                            <li>To provide and maintain our service</li>
                            <li>To notify you about changes to our service</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information to improve our service</li>
                            <li>To send you marketing communications (with your consent)</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Data Security</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            We have implemented appropriate security measures to prevent your personal data from being
                            accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal
                            data to those employees and partners who have a business need to know.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Your Rights</h2>
                        <p className="text-[#666] leading-relaxed mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 text-[#666] space-y-2">
                            <li>Request access to your personal data</li>
                            <li>Request correction of your personal data</li>
                            <li>Request erasure of your personal data</li>
                            <li>Object to processing of your personal data</li>
                            <li>Request restriction of processing your personal data</li>
                            <li>Request transfer of your personal data</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Contact Us</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:support@mimora.co.in" className="text-[#E84A7F] hover:underline">
                                support@mimora.co.in
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
