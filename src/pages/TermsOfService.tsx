import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function TermsOfService() {
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
                <h1 className="text-[36px] md:text-[44px] font-bold text-[#1E1E1E] mb-4">Terms of Service</h1>
                <p className="text-[#666] text-sm mb-12">Last updated: February 12, 2026</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Agreement to Terms</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            By accessing or using Mimora's services, you agree to be bound by these Terms of Service.
                            If you disagree with any part of the terms, you may not access the service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Use of Service</h2>
                        <p className="text-[#666] leading-relaxed mb-4">You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                        <ul className="list-disc pl-6 text-[#666] space-y-2">
                            <li>Use the service in any way that violates any applicable law or regulation</li>
                            <li>Engage in any conduct that restricts or inhibits anyone's use of the service</li>
                            <li>Impersonate or attempt to impersonate Mimora, a Mimora employee, another user, or any other person</li>
                            <li>Use the service to transmit any advertising or promotional material without our prior written consent</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">User Accounts</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            When you create an account with us, you must provide accurate, complete, and current information.
                            You are responsible for safeguarding your account password and for any activities or actions under your account.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Bookings and Payments</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            All bookings made through Mimora are subject to availability and confirmation. Prices are subject to change
                            without notice. Payment terms will be clearly communicated at the time of booking.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Cancellation Policy</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            Cancellation policies may vary depending on the service provider. Specific cancellation terms will be
                            provided at the time of booking. Please review these carefully before confirming your booking.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Intellectual Property</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            The service and its original content, features, and functionality are owned by Mimora and are protected
                            by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Limitation of Liability</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            In no event shall Mimora, nor its directors, employees, partners, agents, suppliers, or affiliates,
                            be liable for any indirect, incidental, special, consequential, or punitive damages arising out of
                            your access to or use of the service.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Changes to Terms</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            We reserve the right to modify or replace these Terms at any time. We will provide notice of any
                            material changes by posting the new Terms on this page with an updated "Last updated" date.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Contact Us</h2>
                        <p className="text-[#666] leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us at{' '}
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

export default TermsOfService;
