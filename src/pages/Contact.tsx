import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

function Contact() {
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
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-[36px] md:text-[44px] font-bold text-[#1E1E1E] mb-4">Contact Us</h1>
                    <p className="text-[#666] text-lg max-w-[600px] mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Email */}
                    <div className="bg-[#FAFAFA] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-[#E84A7F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6 text-[#E84A7F]" />
                        </div>
                        <h3 className="text-[18px] font-semibold text-[#1E1E1E] mb-2">Email</h3>
                        <a href="mailto:support@mimora.co.in" className="text-[#666] hover:text-[#E84A7F] transition-colors">
                            support@mimora.co.in
                        </a>
                    </div>

                    {/* Phone */}
                    <div className="bg-[#FAFAFA] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-[#E84A7F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-6 h-6 text-[#E84A7F]" />
                        </div>
                        <h3 className="text-[18px] font-semibold text-[#1E1E1E] mb-2">Phone</h3>
                        <a href="tel:+919677248878" className="text-[#666] hover:text-[#E84A7F] transition-colors">
                            +91 96772 48878
                        </a>
                    </div>

                    {/* Location */}
                    <div className="bg-[#FAFAFA] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-[#E84A7F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-6 h-6 text-[#E84A7F]" />
                        </div>
                        <h3 className="text-[18px] font-semibold text-[#1E1E1E] mb-2">Office</h3>
                        <p className="text-[#666]">
                            Chennai, Tamil Nadu
                            <br />
                            India
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-[#FFF0F5] rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-[24px] font-semibold text-[#1E1E1E] mb-4">Business Inquiries</h2>
                    <p className="text-[#666] mb-6 max-w-[700px] mx-auto">
                        For partnership opportunities, business collaborations, or media inquiries,
                        please reach out to our business development team.
                    </p>
                    <a
                        href="mailto:support@mimora.co.in"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E84A7F] text-white text-[15px] font-semibold rounded-full hover:bg-[#d43d6f] transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        support@mimora.co.in
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Contact;
