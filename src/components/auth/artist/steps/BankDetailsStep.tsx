import React from 'react';
import { useArtistSignup } from '../ArtistSignupContext';
import { BackArrowIcon } from '../icons';
import { PROFESSIONS } from '../artist-signup.types';
import ArtistProfilePreview from '@/components/auth/ArtistProfilePreview';

const BankDetailsStep: React.FC = () => {
    const {
        formData, setFormStep,
        selectedProfessions, skills, portfolioImages,
        bankDetails, handleBankFieldChange,
        bankAccountMatch, upiValid, canSubmitBank, bankProgress,
        handleBankSave, handleBankClear,
    } = useArtistSignup();

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            <div className="w-full md:w-[70%] pl-14 py-6 flex flex-col h-full">
                <div className="w-[90%] flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setFormStep('method-select')} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50">
                                <BackArrowIcon />
                            </button>
                            <h1 className="text-xl font-semibold">Bank details</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleBankClear} className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Clear</button>
                            <button onClick={handleBankSave} disabled={!canSubmitBank && !upiValid} className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${(canSubmitBank || upiValid) ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}>Submit</button>
                        </div>
                    </div>

                    <div className="w-[60%] h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                        <div className="h-full bg-linear-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${bankProgress * 100}%` }} />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Add your bank details</h2>
                        <div className="space-y-5 max-w-md">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Account holder name</label>
                                <input type="text" value={bankDetails.accountHolderName} onChange={(e) => handleBankFieldChange('accountHolderName', e.target.value)} placeholder="Eg. Naveen Kumar" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-400" />
                                <p className="text-[11px] text-gray-400 mt-1">Add your name as per in the bank account</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Account number / IBAN</label>
                                <input type="text" value={bankDetails.accountNumber} onChange={(e) => handleBankFieldChange('accountNumber', e.target.value.replace(/\D/g, ''))} placeholder="Eg. 50100466215966" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-400" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Re-enter your Account number / IBAN</label>
                                <div className="relative">
                                    <input type="text" value={bankDetails.confirmAccountNumber} onChange={(e) => handleBankFieldChange('confirmAccountNumber', e.target.value.replace(/\D/g, ''))} placeholder="Eg. 50100466215966" className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-900 bg-white focus:outline-none transition-colors placeholder:text-gray-400 ${bankAccountMatch ? 'border-green-400' : 'border-gray-300 focus:border-gray-500'}`} />
                                    {bankAccountMatch && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-500"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M8 12l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            <span className="text-xs font-medium text-green-600">Verified</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Bank Name</label>
                                <input type="text" value={bankDetails.bankName} onChange={(e) => handleBankFieldChange('bankName', e.target.value)} placeholder="Eg. HDFC" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-400" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">IFSC Code</label>
                                <input type="text" value={bankDetails.ifscCode} onChange={(e) => handleBankFieldChange('ifscCode', e.target.value.toUpperCase())} placeholder="Eg. HDFC0002034" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-400" />
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400 font-medium">Or</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">UPI ID</label>
                                <div className="relative">
                                    <input type="text" value={bankDetails.upiId} onChange={(e) => handleBankFieldChange('upiId', e.target.value)} placeholder="Eg. admin-1@okhdfcbank" className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-900 bg-white focus:outline-none transition-colors placeholder:text-gray-400 ${upiValid ? 'border-green-400' : 'border-gray-300 focus:border-gray-500'}`} />
                                    {upiValid && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-500"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M8 12l2.5 2.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            <span className="text-xs font-medium text-green-600">Verified</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-0 md:w-[30%] border-l border-gray-200 hidden lg:block">
                <div className="h-10 bg-linear-to-b from-pink-100 to-white"></div>
                <div className="p-6">
                    <ArtistProfilePreview name={formData.fullName} profilePicUrl={formData.profilePicUrl} profession={selectedProfessions.map(id => PROFESSIONS.find(p => p.id === id)?.label || '').filter(Boolean)} bio={formData.bio} kycVerified={formData.kycStatus === 'verified'} certificateUrl={formData.certificateUrl} city={formData.address.city} state={formData.address.state} street={formData.address.street} skills={skills} portfolioImages={portfolioImages} />
                </div>
            </div>
        </div>
    );
};

export default BankDetailsStep;
