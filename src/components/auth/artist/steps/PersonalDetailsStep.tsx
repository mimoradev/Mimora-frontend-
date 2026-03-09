import React from 'react';
import { useArtistSignup } from '../ArtistSignupContext';
import { BackArrowIcon } from '../icons';
import { InputField, SelectField, TextareaField, DatePickerField, PhoneInputField, OTPInputField } from '../form-fields';
import ArtistProfilePreview from '@/components/auth/ArtistProfilePreview';
import { storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ─── Progress Bar ────────────────────────────────────────────────────
const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
    <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
            <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i < current ? 'bg-[#E91E63]' : 'bg-gray-200'}`}
            />
        ))}
    </div>
);

// ─── Personal Details Step ───────────────────────────────────────────
const PersonalDetailsStep: React.FC = () => {
    const {
        signupMethod,
        subStep,
        formData, updateFormData,
        getFieldError, isFormValid,
        isSaving,
        phoneVerified, emailVerified,
        otpSent, otpSending, otpError, otpSuccess, isLoading,
        isUploadingImage, profilePicInputRef,
        geoLocation, geoLoading, geoError, requestLocation, locationCaptured,
        handleProfilePicUpload, handleRemoveProfilePic,
        handleSendPhoneOTP, handleVerifyPhoneOTP,
        handleSendEmailOTP, handleVerifyEmailOTP,
        handleBack, handleSaveAndContinue, handleClear,
        scrollContainerRef, contentRef,
        error,
        skills,
        // KYC
        kycLoading, faceVerificationLoading, artistId,
        handleStartKYC, handleStartFaceVerification, handleCheckKYCStatus, handleRetryKYC,
    } = useArtistSignup();

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Left side - Form (70%) */}
            <div className="w-full md:w-[70%] pl-14 py-6 flex flex-col h-full">
                {/* Form container - 80% of left side */}
                <div className="w-[80%] flex flex-col h-full">
                    {/* Header - Fixed */}
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={handleBack} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50">
                                <BackArrowIcon />
                            </button>
                            <h1 className="text-xl font-semibold">Personal Details</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleClear} className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                                Clear
                            </button>
                            <button
                                onClick={handleSaveAndContinue}
                                disabled={!isFormValid() || isSaving}
                                className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${isFormValid() && !isSaving
                                    ? 'bg-gray-700 hover:bg-gray-800'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSaving && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {isSaving ? 'Saving...' : 'Save & continue'}
                            </button>
                        </div>
                    </div>

                    {/* Progress - Fixed */}
                    <div className="mb-6 shrink-0">
                        <ProgressBar current={subStep} total={4} />
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>Step {subStep} of 4</span>
                            <span className="text-gray-300">•</span>
                            <span>Personal Details</span>
                        </div>
                    </div>

                    {/* Scrollable Form Section */}
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pr-4">
                        <div ref={contentRef}>
                            <h2 className="text-2xl font-semibold mb-6">
                                {subStep === 1 && 'Basic Information'}
                                {subStep === 2 && 'Identity Verification'}
                                {subStep === 3 && 'Professional Information'}
                                {subStep === 4 && 'Address Details'}
                            </h2>

                            {/* SUBSTEP 1: Basic Information */}
                            {subStep === 1 && (
                                <div className="space-y-4">
                                    <InputField
                                        label="Full name"
                                        placeholder="Eg. Naveen Kumar"
                                        value={formData.fullName}
                                        onChange={(v) => updateFormData({ fullName: v })}
                                        helperText="Make sure this matches the name on your government ID"
                                        error={getFieldError('fullName')}
                                        required
                                    />

                                    {signupMethod === 'phone' ? (
                                        <>
                                            <PhoneInputField
                                                countryCode={formData.countryCode}
                                                phone={formData.phone}
                                                onCountryCodeChange={(v) => updateFormData({ countryCode: v })}
                                                onPhoneChange={(v) => updateFormData({ phone: v })}
                                                verified={phoneVerified}
                                                onVerifyClick={handleSendPhoneOTP}
                                                canVerify={!phoneVerified && formData.phone.replace(/\s/g, '').length >= 10}
                                                error={getFieldError('phone')}
                                                required
                                            />

                                            {otpSent && !phoneVerified && (
                                                <div className="ml-0">
                                                    <OTPInputField
                                                        value={formData.otp}
                                                        onChange={(v: string) => updateFormData({ otp: v })}
                                                        onComplete={async () => {
                                                            await handleVerifyPhoneOTP();
                                                            return true;
                                                        }}
                                                        onResend={handleSendPhoneOTP}
                                                        isVerifying={isLoading}
                                                        isSending={otpSending}
                                                        error={otpError}
                                                        successMessage={otpSuccess}
                                                    />
                                                </div>
                                            )}

                                            <InputField
                                                label="Email address"
                                                placeholder="Eg. name@gmail.com"
                                                value={formData.email}
                                                onChange={(v) => updateFormData({ email: v })}
                                                type="email"
                                                error={getFieldError('email')}
                                                required
                                            />
                                        </>
                                    ) : signupMethod === 'email' ? (
                                        <>
                                            <div className="space-y-2">
                                                <InputField
                                                    label="Email address"
                                                    placeholder="Eg. name@gmail.com"
                                                    value={formData.email}
                                                    onChange={(v) => updateFormData({ email: v })}
                                                    type="email"
                                                    disabled={emailVerified}
                                                    error={getFieldError('email')}
                                                    required
                                                    suffix={
                                                        emailVerified ? (
                                                            <span className="text-sm text-emerald-600">✓ Verified</span>
                                                        ) : formData.email && !emailVerified ? (
                                                            <button
                                                                onClick={handleSendEmailOTP}
                                                                disabled={otpSending || !formData.email}
                                                                className="text-sm text-[#E91E63] hover:underline disabled:opacity-50"
                                                            >
                                                                {otpSending ? 'Sending...' : 'Verify'}
                                                            </button>
                                                        ) : null
                                                    }
                                                />
                                            </div>

                                            {otpSent && !emailVerified && (
                                                <div className="ml-0">
                                                    <OTPInputField
                                                        value={formData.otp}
                                                        onChange={(v: string) => updateFormData({ otp: v })}
                                                        onComplete={async () => {
                                                            await handleVerifyEmailOTP();
                                                            return true;
                                                        }}
                                                        onResend={handleSendEmailOTP}
                                                        isVerifying={isLoading}
                                                        isSending={otpSending}
                                                        error={otpError}
                                                        successMessage={otpSuccess}
                                                    />
                                                </div>
                                            )}

                                            <PhoneInputField
                                                countryCode={formData.countryCode}
                                                phone={formData.phone}
                                                onCountryCodeChange={(v) => updateFormData({ countryCode: v })}
                                                onPhoneChange={(v) => updateFormData({ phone: v })}
                                                showVerify={false}
                                                error={getFieldError('phone')}
                                                required
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <InputField
                                                label="Email address"
                                                placeholder="Eg. name@gmail.com"
                                                value={formData.email}
                                                onChange={(v) => updateFormData({ email: v })}
                                                type="email"
                                                disabled={emailVerified}
                                                error={getFieldError('email')}
                                                required
                                                suffix={emailVerified && <span className="text-sm text-emerald-600">✓ Verified</span>}
                                            />

                                            <PhoneInputField
                                                countryCode={formData.countryCode}
                                                phone={formData.phone}
                                                onCountryCodeChange={(v) => updateFormData({ countryCode: v })}
                                                onPhoneChange={(v) => updateFormData({ phone: v })}
                                                showVerify={false}
                                                error={getFieldError('phone')}
                                                required
                                            />
                                        </>
                                    )}

                                    <DatePickerField
                                        label="Birthday"
                                        value={formData.birthday}
                                        onChange={(v) => updateFormData({ birthday: v })}
                                        helperText="You must be at least 18 years old"
                                        error={getFieldError('birthday')}
                                        required
                                    />

                                    <SelectField
                                        label="Gender"
                                        value={formData.gender}
                                        onChange={(v) => updateFormData({ gender: v })}
                                        options={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                            { value: 'other', label: 'Other' },
                                        ]}
                                        error={getFieldError('gender')}
                                        required
                                    />

                                    <SelectField
                                        label="Years of Experience"
                                        value={formData.experience}
                                        onChange={(v) => updateFormData({ experience: v })}
                                        placeholder="Select your experience"
                                        options={[
                                            { value: '0-2', label: '0-2 years' },
                                            { value: '3-5', label: '3-5 years' },
                                            { value: '6-10', label: '6-10 years' },
                                            { value: '10+', label: '10+ years' },
                                        ]}
                                        error={getFieldError('experience')}
                                        required
                                    />

                                    <TextareaField
                                        label="Bio"
                                        placeholder="Tell us about yourself, your skills, specializations, and what makes you unique as an artist..."
                                        value={formData.bio}
                                        onChange={(v) => updateFormData({ bio: v })}
                                        helperText="Minimum 20 characters, maximum 500"
                                        error={getFieldError('bio')}
                                        required
                                        maxLength={500}
                                    />
                                </div>
                            )}

                            {/* SUBSTEP 2: Identity Verification */}
                            {subStep === 2 && (
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        ref={profilePicInputRef}
                                        onChange={handleProfilePicUpload}
                                        accept="image/jpeg,image/png"
                                        className="hidden"
                                    />

                                    {/* KYC Verification Card */}
                                    <div className={`p-4 border rounded-lg bg-white ${formData.kycStatus === 'verified' ? 'border-emerald-200 bg-emerald-50/30' :
                                        formData.kycStatus === 'failed' ? 'border-red-200 bg-red-50/30' :
                                            formData.kycStatus === 'in_progress' || formData.kycStatus === 'document_verified' ? 'border-amber-200 bg-amber-50/30' :
                                                'border-gray-200'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">KYC verification</h3>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {formData.kycStatus === 'verified'
                                                        ? 'Your identity has been verified successfully.'
                                                        : formData.kycStatus === 'in_progress' || formData.kycStatus === 'document_verified'
                                                            ? 'Verification is being processed. Click the button to check the latest status.'
                                                            : formData.kycStatus === 'failed'
                                                                ? 'Verification failed. Please try again.'
                                                                : 'Verify your identity with Aadhaar/PAN document verification.'}
                                                </p>
                                            </div>
                                            {formData.kycStatus === 'verified' ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 shrink-0">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-medium">Verified</span>
                                                </div>
                                            ) : formData.kycStatus === 'failed' ? (
                                                <button
                                                    className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
                                                    onClick={handleRetryKYC}
                                                    disabled={kycLoading || !artistId}
                                                >
                                                    {kycLoading && (
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                    )}
                                                    Retry KYC
                                                </button>
                                            ) : formData.kycStatus === 'in_progress' || formData.kycStatus === 'document_verified' || formData.kycStatus === 'pending' ? (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">In Progress</span>
                                                    <button
                                                        className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                        onClick={handleCheckKYCStatus}
                                                        disabled={kycLoading}
                                                    >
                                                        {kycLoading && (
                                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                            </svg>
                                                        )}
                                                        Check Status
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="px-5 py-2.5 bg-[#1E1E1E] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
                                                    onClick={handleStartKYC}
                                                    disabled={kycLoading || !artistId}
                                                >
                                                    {kycLoading && (
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                    )}
                                                    {!artistId ? 'Complete signup first' : 'Verify KYC'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Profile Picture Upload Card */}
                                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                        <h3 className="font-medium text-gray-900 mb-1">Profile photo</h3>

                                        {!formData.profilePicUrl ? (
                                            <>
                                                <div
                                                    className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                                    onClick={() => profilePicInputRef.current?.click()}
                                                >
                                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm text-gray-500 mb-3">Add a profile image (Optional)</p>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            profilePicInputRef.current?.click();
                                                        }}
                                                        disabled={isUploadingImage}
                                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                    >
                                                        {isUploadingImage ? 'Uploading...' : 'Browse File'}
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">Note: Image size should be under 1MB. Support JPEG, PNG format</p>
                                            </>
                                        ) : (
                                            <div className="mt-3 flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                                    <img
                                                        src={formData.profilePicUrl}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => profilePicInputRef.current?.click()}
                                                        disabled={isUploadingImage}
                                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
                                                    >
                                                        {isUploadingImage ? 'Uploading...' : 'Upload new photo'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveProfilePic}
                                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors text-left"
                                                    >
                                                        Remove photo
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Selfie / Face Verification */}
                                    {formData.profilePicUrl && (
                                        <div className={`p-4 border rounded-lg bg-white ${formData.faceVerified ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200'
                                            }`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">Selfie verification</h3>
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        {formData.faceVerified
                                                            ? 'Your selfie has been verified successfully.'
                                                            : formData.kycStatus !== 'verified' && formData.kycStatus !== 'document_verified'
                                                                ? 'Complete KYC verification first before selfie verification.'
                                                                : 'Take a selfie so we can match it with your profile image.'}
                                                    </p>
                                                    {formData.faceVerified ? (
                                                        <div className="mt-3 flex items-center gap-1.5 text-emerald-600">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="font-medium">Verified</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="mt-3 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                            onClick={handleStartFaceVerification}
                                                            disabled={faceVerificationLoading || !artistId || (formData.kycStatus !== 'verified' && formData.kycStatus !== 'document_verified')}
                                                        >
                                                            {faceVerificationLoading && (
                                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                            )}
                                                            {formData.kycStatus !== 'verified' && formData.kycStatus !== 'document_verified'
                                                                ? 'Complete KYC first'
                                                                : 'Verify Selfie'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="w-28 h-28 shrink-0 ml-4">
                                                    <svg viewBox="0 0 100 100" className="w-full h-full text-gray-300">
                                                        <circle cx="50" cy="35" r="18" fill="currentColor" opacity="0.3" />
                                                        <rect x="30" y="55" width="40" height="35" rx="5" fill="currentColor" opacity="0.2" />
                                                        <rect x="65" y="45" width="15" height="25" rx="3" fill="currentColor" opacity="0.4" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SUBSTEP 3: Professional Information */}
                            {subStep === 3 && (
                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        id="certificate-upload"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                                            if (!validTypes.includes(file.type)) {
                                                console.error('Please select JPEG, PNG, or PDF file');
                                                return;
                                            }

                                            if (file.size > 2 * 1024 * 1024) {
                                                console.error('File size should be under 2MB');
                                                return;
                                            }

                                            try {
                                                const fileName = `certificates/${Date.now()}_${file.name}`;
                                                const storageRef = ref(storage, fileName);
                                                await uploadBytes(storageRef, file);
                                                const downloadUrl = await getDownloadURL(storageRef);
                                                updateFormData({ certificateUrl: downloadUrl });
                                                console.log('Certificate uploaded successfully:', downloadUrl);
                                            } catch (error) {
                                                console.error('Error uploading certificate:', error);
                                            }
                                        }}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="hidden"
                                    />

                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">How did you learned the Art?</h2>

                                    <div className="space-y-3">
                                        {/* Professional Training Option */}
                                        <div
                                            className={`border rounded-lg cursor-pointer transition-colors ${formData.howDidYouLearn === 'professional'
                                                ? 'border-gray-300'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <label className="flex items-center gap-3 p-4 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="howDidYouLearn"
                                                    value="professional"
                                                    checked={formData.howDidYouLearn === 'professional'}
                                                    onChange={(e) => updateFormData({ howDidYouLearn: e.target.value as 'professional' | 'self-learned' | 'apprentice' })}
                                                    className="w-5 h-5 text-[#0D9488] focus:ring-[#0D9488] border-gray-300"
                                                />
                                                <span className="font-medium text-gray-900">Professional Training</span>
                                            </label>

                                            {formData.howDidYouLearn === 'professional' && (
                                                <div className="px-4 pb-4">
                                                    <div
                                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                                        onClick={() => document.getElementById('certificate-upload')?.click()}
                                                    >
                                                        {formData.certificateUrl ? (
                                                            <div className="text-center">
                                                                <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <p className="text-sm text-emerald-600 font-medium">Certificate uploaded</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateFormData({ certificateUrl: '' });
                                                                    }}
                                                                    className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                                </svg>
                                                                <p className="text-sm font-medium text-gray-700">Upload your certificate</p>
                                                                <p className="text-xs text-gray-500 mt-0.5">Choose your weightage certificates</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        document.getElementById('certificate-upload')?.click();
                                                                    }}
                                                                    disabled={isUploadingImage}
                                                                    className="mt-3 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                >
                                                                    {isUploadingImage ? 'Uploading...' : 'Browse File'}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-2">Note: Size should be under 2MB. Support JPEG, PNG, PDF format</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Self-Learned Option */}
                                        <div
                                            className={`border rounded-lg cursor-pointer transition-colors ${formData.howDidYouLearn === 'self-learned'
                                                ? 'border-gray-300'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <label className="flex items-center gap-3 p-4 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="howDidYouLearn"
                                                    value="self-learned"
                                                    checked={formData.howDidYouLearn === 'self-learned'}
                                                    onChange={(e) => updateFormData({ howDidYouLearn: e.target.value as 'professional' | 'self-learned' | 'apprentice' })}
                                                    className="w-5 h-5 text-[#0D9488] focus:ring-[#0D9488] border-gray-300"
                                                />
                                                <span className="font-medium text-gray-900">Self-Learned</span>
                                            </label>
                                        </div>

                                        {/* Apprenticeship Option */}
                                        <div
                                            className={`border rounded-lg cursor-pointer transition-colors ${formData.howDidYouLearn === 'apprentice'
                                                ? 'border-gray-300'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <label className="flex items-center gap-3 p-4 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="howDidYouLearn"
                                                    value="apprentice"
                                                    checked={formData.howDidYouLearn === 'apprentice'}
                                                    onChange={(e) => updateFormData({ howDidYouLearn: e.target.value as 'professional' | 'self-learned' | 'apprentice' })}
                                                    className="w-5 h-5 text-[#0D9488] focus:ring-[#0D9488] border-gray-300"
                                                />
                                                <span className="font-medium text-gray-900">Apprenticeship / Trained Under a Mentor</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SUBSTEP 4: Address Details */}
                            {subStep === 4 && (
                                <div className="space-y-4">
                                    <button
                                        type="button"
                                        disabled={geoLoading}
                                        onClick={() => {
                                            requestLocation();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-800 disabled:opacity-60"
                                    >
                                        {geoLoading ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Getting location...
                                            </>
                                        ) : (locationCaptured || geoLocation) ? (
                                            <>
                                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Location captured
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <circle cx="12" cy="12" r="3" />
                                                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.3-6.7-1.4 1.4M6.7 17.3l-1.4 1.4m0-13.4 1.4 1.4m10.6 10.6 1.4 1.4" />
                                                </svg>
                                                Current location
                                            </>
                                        )}
                                    </button>
                                    {geoError && (
                                        <p className="text-xs text-red-500 text-center">{geoError}</p>
                                    )}

                                    <InputField
                                        label="Flat, House no., Building, Company, Apartment"
                                        placeholder="Eg. 14/13"
                                        value={formData.address.flatNo}
                                        onChange={(v) => updateFormData({ address: { ...formData.address, flatNo: v } })}
                                    />

                                    <InputField
                                        label="Area, Street, Sector, Village"
                                        placeholder="Eg. Anna Nagar"
                                        value={formData.address.street}
                                        onChange={(v) => updateFormData({ address: { ...formData.address, street: v } })}
                                        required
                                    />

                                    <InputField
                                        label="Landmark"
                                        placeholder="Eg. HDFC bank opposite"
                                        value={formData.address.landmark}
                                        onChange={(v) => updateFormData({ address: { ...formData.address, landmark: v } })}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            label="Pincode"
                                            placeholder="Eg. 600024"
                                            value={formData.address.pincode}
                                            onChange={(v) => updateFormData({ address: { ...formData.address, pincode: v } })}
                                            required
                                        />
                                        <InputField
                                            label="Town/City"
                                            placeholder="Eg. Chennai"
                                            value={formData.address.city}
                                            onChange={(v) => updateFormData({ address: { ...formData.address, city: v } })}
                                            required
                                        />
                                    </div>

                                    <InputField
                                        label="State"
                                        placeholder="Eg. Tamil Nadu"
                                        value={formData.address.state}
                                        onChange={(v) => updateFormData({ address: { ...formData.address, state: v } })}
                                        required
                                    />
                                </div>
                            )}

                            {/* Error display */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Profile Preview (30%) */}
            <div className="w-0 md:w-[30%] border-l border-gray-200 hidden lg:block">
                <div className="h-10 bg-linear-to-b from-pink-100 to-white"></div>
                <div className="p-6">
                    <ArtistProfilePreview
                        name={formData.fullName}
                        profilePicUrl={formData.profilePicUrl}
                        bio={formData.bio}
                        kycVerified={formData.kycStatus === 'verified'}
                        certificateUrl={formData.certificateUrl}
                        city={formData.address.city}
                        state={formData.address.state}
                        street={formData.address.street}
                        skills={skills}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsStep;
