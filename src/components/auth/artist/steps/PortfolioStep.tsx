import React from 'react';
import { toast } from 'sonner';
import { useArtistSignup } from '../ArtistSignupContext';
import { BackArrowIcon } from '../icons';
import { PROFESSIONS } from '../artist-signup.types';
import ArtistProfilePreview from '@/components/auth/ArtistProfilePreview';

const PortfolioStep: React.FC = () => {
    const {
        formData, setFormStep,
        selectedProfessions, skills,
        portfolioImages, isUploadingPortfolio,
        draggedIndex, portfolioInputRef,
        handlePortfolioUpload, handlePortfolioDelete,
        handlePortfolioDragStart, handlePortfolioDragOver, handlePortfolioDragEnd,
        handlePortfolioSave,
    } = useArtistSignup();

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            <div className="w-full md:w-[70%] pl-14 py-6 flex flex-col h-full">
                <div className="w-[90%] flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setFormStep('method-select')} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50">
                                <BackArrowIcon />
                            </button>
                            <h1 className="text-xl font-semibold">Portfolio</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {portfolioImages.length > 1 && (
                                <button onClick={() => toast.info('Drag photos to reorder them')} className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    Reorder
                                </button>
                            )}
                            <button onClick={handlePortfolioSave} disabled={portfolioImages.length === 0} className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${portfolioImages.length > 0 ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}>
                                Submit
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4">
                        <input ref={portfolioInputRef} type="file" multiple accept="image/jpeg,image/png,image/jpg" onChange={handlePortfolioUpload} className="hidden" />

                        {portfolioImages.length === 0 && !isUploadingPortfolio ? (
                            <div onClick={() => portfolioInputRef.current?.click()} className="flex flex-col items-center justify-center py-32 cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors">
                                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload up to 10 photos</h3>
                                <p className="text-sm text-gray-500">Minimum recommended is 5. JPEG, PNG, PDF up to 2 MB.</p>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {portfolioImages.map((url, index) => (
                                        <div key={index} draggable onDragStart={() => handlePortfolioDragStart(index)} onDragOver={(e) => handlePortfolioDragOver(e, index)} onDragEnd={handlePortfolioDragEnd} className={`relative group aspect-4/5 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all ${draggedIndex === index ? 'border-pink-400 opacity-60 scale-95' : 'border-transparent'}`}>
                                            <img src={url} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <button onClick={(e) => { e.stopPropagation(); handlePortfolioDelete(index); }} className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {portfolioImages.length < 10 && (
                                        <div onClick={() => portfolioInputRef.current?.click()} className="aspect-4/5 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 mb-1"><path d="M12 5v14M5 12h14" /></svg>
                                            <span className="text-xs text-gray-500">Add more</span>
                                        </div>
                                    )}
                                </div>
                                {isUploadingPortfolio && (
                                    <div className="flex items-center gap-3 py-3 px-4 bg-pink-50 rounded-xl">
                                        <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm text-pink-700">Uploading photos...</span>
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 mt-2">{portfolioImages.length}/10 photos • Drag to reorder</p>
                            </div>
                        )}
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

export default PortfolioStep;
