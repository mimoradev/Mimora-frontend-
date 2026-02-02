import React from "react";

const AppDownloadSection: React.FC = () => {
    return (
        <section className="w-full bg-[#1E1E1E]">
            {/* Desktop View */}
            <div className="hidden md:flex justify-center items-center w-full">
                <img
                    src="/info/landing/join/web.png"
                    alt="Desktop App Download"
                    className="w-full max-w-[1440px] h-auto object-contain"
                />
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden justify-center items-center w-full">
                <img
                    src="/info/landing/join/Form Container.png"
                    alt="Mobile App Download"
                    className="w-full h-auto object-contain"
                />
            </div>
        </section>
    );
};

export default AppDownloadSection;
